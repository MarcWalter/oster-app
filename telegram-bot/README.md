# Oster-App Telegram Bot

Telegram-Bot für zeitgesteuerte Benachrichtigungen zur Karwoche.

## Setup

### 1. Bot erstellen
1. Öffne Telegram und suche nach `@BotFather`
2. Sende `/newbot`
3. Wähle einen Namen (z.B. "Oster App")
4. Wähle einen Username (z.B. "osterapp2026_bot")
5. Kopiere den Bot-Token

### 2. Lokal testen
```bash
npm install
echo "TELEGRAM_BOT_TOKEN=dein_token_hier" > .env
npm start
```

### 3. Deployment auf Railway.app

1. Gehe zu [railway.app](https://railway.app) und melde dich an
2. Klicke "New Project" → "Deploy from GitHub repo"
3. Verbinde dein GitHub-Repository
4. Wähle das Repository aus
5. Gehe zu "Variables" und füge hinzu:
   - `TELEGRAM_BOT_TOKEN` = dein Bot-Token
6. Railway erkennt automatisch `package.json` und startet den Bot

**Kosten:**
- Kostenlos: 500h/Monat (~20 Tage)
- Pro: $5/Monat (unbegrenzt)

### 4. Alternative: Render.com
1. Gehe zu [render.com](https://render.com)
2. "New" → "Web Service"
3. Verbinde GitHub-Repository
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables: `TELEGRAM_BOT_TOKEN`

**Kosten:** Kostenlos (schläft nach 15min Inaktivität, aber Cron-Jobs wecken ihn auf)

## Bot-Befehle

- `/start` - Registrierung und Begrüßung
- `/naechstes` - Zeigt nächstes Ereignis
- `/alle` - Timeline aller Ereignisse
- `/stop` - Benachrichtigungen deaktivieren

## Ereignisse anpassen

Bearbeite `events.json` um Zeitpunkte und Texte anzupassen.

## Skalierung

- Bis 1000 Nutzer: Keine Anpassungen nötig
- 1000-10.000: Railway Pro ($5/Monat)
- 10.000+: Rate-Limiting implementieren (30 Msg/Sek)

## Bot-Username

Nach Erstellung bei @BotFather erhältst du einen Link:
`t.me/dein_bot_username`

Diesen Link auf der Landing-Page verwenden.
