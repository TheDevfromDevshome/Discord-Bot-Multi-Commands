/* Team Update Bot - Ready to run
 * IMPORTANT: create a .env file (or set env vars) with:
 * TOKEN=your_bot_token
 * CLIENT_ID=your_application_client_id
 * GUILD_ID=your_test_guild_id
 *
 * The code intentionally does NOT include your token. Put it in .env.
 */

require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Missing environment variables. Create a .env file with TOKEN, CLIENT_ID and GUILD_ID.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/**
 * === CONFIGURE YOUR COMMANDS HERE ===
 * You can enable/disable commands via `active: true/false`.
 * Customize title, color, options and embedDescription.
 *
 * Option types: 'user', 'role', 'string'
 * embedDescription receives an object with the parsed options.
 */
const teamUpdates = [
  {
    active: true,
    name: 'uprank',
    description: 'Erstellt ein Team-UpRank-Update',
    title: 'I Team Update ð',
    color: '#00FF00',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'role', name: 'from', description: 'Vom Rang', required: true },
      { type: 'role', name: 'to', description: 'Zum Rang', required: true },
      { type: 'string', name: 'reason', description: 'Grund', required: false }
    ],
    embedDescription: (o) => `${o.user} kriegt einen UpRank von ${o.from} auf ${o.to}
\n**Grund:** ${o.reason || 'Kein Grund angegeben'}`
  },
  {
    active: true,
    name: 'downrank',
    description: 'Erstellt ein Team-DownRank-Update',
    title: 'Team Update â ï¸',
    color: '#FF0000',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'role', name: 'from', description: 'Vom Rang', required: true },
      { type: 'role', name: 'to', description: 'Zum Rang', required: true },
      { type: 'string', name: 'reason', description: 'Grund', required: false }
    ],
    embedDescription: (o) => `${o.user} wird zurÃ¼ckgestuft von ${o.from} auf ${o.to}\n\n**Grund:** ${o.reason || 'Kein Grund angegeben'}`
  },
  {
    active: true,
    name: 'award',
    description: 'Vergibt eine Auszeichnung an einen User',
    title: 'Team Auszeichnung ð',
    color: '#FFD700',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'string', name: 'award', description: 'Name der Auszeichnung', required: true },
      { type: 'string', name: 'reason', description: 'Grund', required: false }
    ],
    embedDescription: (o) => `${o.user} erhÃ¤lt die Auszeichnung: **${o.award}**\n\n**Grund:** ${o.reason || 'Kein Grund angegeben'}`
  },
  {
    active: false,
    name: 'promotion',
    description: 'Promotion Update',
    title: 'Promotion ð',
    color: '#1E90FF',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'string', name: 'reason', description: 'Grund', required: false }
    ],
    embedDescription: (o) => `${o.user} bekommt eine Promotion!\n\n**Grund:** ${o.reason || 'Kein Grund angegeben'}`
  },
  {
    active: false,
    name: 'demotion',
    description: 'Demotion Update',
    title: 'Demotion â¡',
    color: '#FF4500',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'string', name: 'reason', description: 'Grund', required: false }
    ],
    embedDescription: (o) => `${o.user} wird demotioniert.\n\n**Grund:** ${o.reason || 'Kein Grund angegeben'}`
  },
  {
    active: false,
    name: 'milestone',
    description: 'Meilenstein Update',
    title: 'Meilenstein ð¯',
    color: '#800080',
    options: [
      { type: 'string', name: 'milestone', description: 'Meilenstein', required: true },
      { type: 'string', name: 'description', description: 'Beschreibung', required: false }
    ],
    embedDescription: (o) => `Neuer Meilenstein erreicht: **${o.milestone}**\n${o.description || ''}`
  },
  {
    active: false,
    name: 'shoutout',
    description: 'Shoutout fÃ¼r ein Teammitglied',
    title: 'Shoutout ð',
    color: '#FFA500',
    options: [
      { type: 'user', name: 'user', description: 'Der User', required: true },
      { type: 'string', name: 'message', description: 'Nachricht', required: false }
    ],
    embedDescription: (o) => `Shoutout an ${o.user}!\n${o.message || ''}`
  }
];

/**
 * Register active commands as GUILD commands (fast update).
 * If you prefer global commands (longer cache delay), change Routes.applicationGuildCommands -> Routes.applicationCommands
 */
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const active = teamUpdates.filter(c => c.active);

  const payload = active.map(c => {
    const builder = new SlashCommandBuilder()
      .setName(c.name)
      .setDescription(c.description);
    for (const opt of c.options) {
      if (opt.type === 'user') builder.addUserOption(o => o.setName(opt.name).setDescription(opt.description).setRequired(opt.required));
      if (opt.type === 'role') builder.addRoleOption(o => o.setName(opt.name).setDescription(opt.description).setRequired(opt.required));
      if (opt.type === 'string') builder.addStringOption(o => o.setName(opt.name).setDescription(opt.description).setRequired(opt.required));
    }
    return builder.toJSON();
  });

  try {
    console.log('Registering commands to guild', GUILD_ID);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: payload });
    console.log('Commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag} â registering commands...`);
  await registerCommands();
  console.log('Setup complete.');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = teamUpdates.find(c => c.name === interaction.commandName && c.active);
  if (!cmd) return;

  // build options object
  const opts = {};
  for (const o of cmd.options) {
    if (o.type === 'user') opts[o.name] = interaction.options.getUser(o.name);
    if (o.type === 'role') opts[o.name] = interaction.options.getRole(o.name);
    if (o.type === 'string') opts[o.name] = interaction.options.getString(o.name);
  }

  // build embed
  const embed = new EmbedBuilder()
    .setTitle(cmd.title)
    .setColor(cmd.color)
    .setDescription(cmd.embedDescription(opts))
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
});

client.login(TOKEN);
