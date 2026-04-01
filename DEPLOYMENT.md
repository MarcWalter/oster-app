# Deployment-Anleitung

## GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Repository-Name: `oster-app` (oder beliebig)
3. Sichtbarkeit: Public
4. Erstelle das Repository

## Code hochladen

```bash
git remote add origin https://github.com/[DEIN-USERNAME]/oster-app.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### Option 1: Über Vercel Dashboard (empfohlen)

1. Gehe zu https://vercel.com
2. Klicke auf "Add New" → "Project"
3. Importiere dein GitHub Repository
4. Vercel erkennt automatisch die Konfiguration
5. Klicke auf "Deploy"
6. Fertig! Deine App ist live unter `[projekt-name].vercel.app`

### Option 2: Über Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Domain verbinden (optional)

1. In Vercel Dashboard: Projekt öffnen
2. Settings → Domains
3. Domain hinzufügen (z.B. `ostergeschichte.de`)
4. DNS-Einträge bei deinem Domain-Provider setzen:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

## Wichtig vor dem Launch

1. **Impressum & Datenschutz ausfüllen:**
   - Öffne `impressum.html` und ersetze `[NAME]`, `[ADRESSE]`, `[EMAIL]`
   - Öffne `datenschutz.html` und ersetze `[EMAIL]`

2. **Links einfügen:**
   - Öffne `index.html`
   - Ersetze `[WHATSAPP-LINK]` mit deinem WhatsApp-Kanal-Link
   - Ersetze `[TELEGRAM-LINK]` mit deinem Telegram-Bot-Link (Format: `https://t.me/[BOT-USERNAME]`)

3. **Telegram-Bot starten:**
   - Siehe `telegram-bot/README.md` für Anleitung

## Kosten

- GitHub: Kostenlos
- Vercel: Kostenlos (Hobby-Plan, ausreichend für dieses Projekt)
- Domain (optional): ~10-15€/Jahr