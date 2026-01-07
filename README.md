# Discord-Bot-Multi-Commands
Team Update Bot (discord.js v14)
=================================

Beschreibung
------------
Fertiger Discord-Bot mit 7 anpassbaren Team-Update Slash-Commands (uprank, downrank, award, ...).
Commands können per `active: true/false` an- oder ausgeschaltet werden.

Wichtig: Aus Sicherheitsgründen ist der Bot **ohne** Token ausgeliefert. Du musst ein `.env` erstellen.

Setup
-----
1. Node.js (v16.9.0+) installieren.
2. Projektabhängigkeiten installieren:
   npm install

3. Erstelle eine `.env` Datei im Projektordner mit:
   TOKEN=dein_bot_token
   CLIENT_ID=deine_application_client_id
   GUILD_ID=deine_test_guild_id

   - TOKEN: Bot-Token (Discord Developer Portal)
   - CLIENT_ID: Application (Bot) Client ID
   - GUILD_ID: Server-ID für schnelle Registrierung (empfohlen für Tests)

4. Starte den Bot:
   npm start

Anpassen der Commands
---------------------
Die Datei `index.js` enthält das Array `teamUpdates`. Dort kannst du:
- `active: true/false` setzen (Command an/aus)
- `title`, `color`, `description`, `options` und `embedDescription` anpassen
- Neue Commands hinzufügen im gleichen Format

Hinweis zur Registrierung
-------------------------
Die Commands werden beim `ready`-Event als GUILD-Commands registriert (schnellerer Update-Zyklus).
Falls du globale Commands willst (für alle Server), ersetze `Routes.applicationGuildCommands` mit `Routes.applicationCommands` in `index.js`.
