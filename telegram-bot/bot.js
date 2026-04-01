import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { readFileSync } from 'fs';

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const events = JSON.parse(readFileSync('./events.json', 'utf8'));
const users = new Set();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);
  bot.sendMessage(chatId,
    '🕊️ *Willkommen zur Oster-App!*\n\n' +
    'Erlebe die Ereignisse der Karwoche in Echtzeit – so wie sie vor 2000 Jahren geschahen.\n\n' +
    'Ab Gründonnerstag (2. April) um 6 Uhr erhältst du automatisch Benachrichtigungen zu den historischen Zeitpunkten.\n\n' +
    '*Befehle:*\n' +
    '/naechstes - Nächstes Ereignis\n' +
    '/alle - Alle Ereignisse anzeigen\n' +
    '/stop - Benachrichtigungen deaktivieren',
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/naechstes/, (msg) => {
  const now = new Date();
  const next = events.find(e => new Date(e.zeitpunkt) > now);

  if (!next) {
    bot.sendMessage(msg.chat.id, '✨ Alle Ereignisse sind bereits geschehen. Frohe Ostern!');
    return;
  }

  const time = new Date(next.zeitpunkt);
  const diff = Math.floor((time - now) / 60000);
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  bot.sendMessage(msg.chat.id,
    `${next.emoji} *${next.titel}*\n\n` +
    `⏰ ${time.toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}\n` +
    `⏳ In ${hours}h ${mins}min\n\n` +
    `${next.text}\n\n` +
    `📖 ${next.bibelstelle}`,
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/alle/, (msg) => {
  let timeline = '📅 *Ereignisse der Karwoche*\n\n';
  events.forEach(e => {
    const time = new Date(e.zeitpunkt);
    timeline += `${e.emoji} *${time.toLocaleString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}*\n${e.titel}\n\n`;
  });
  bot.sendMessage(msg.chat.id, timeline, { parse_mode: 'Markdown' });
});

bot.onText(/\/stop/, (msg) => {
  users.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id, '✅ Benachrichtigungen deaktiviert. Mit /start kannst du sie wieder aktivieren.');
});

function scheduleEvents() {
  events.forEach(event => {
    const time = new Date(event.zeitpunkt);
    const cronTime = `${time.getMinutes()} ${time.getHours()} ${time.getDate()} ${time.getMonth() + 1} *`;

    cron.schedule(cronTime, () => {
      const now = new Date();
      const nextEvent = events.find(e => new Date(e.zeitpunkt) > now);
      const nextText = nextEvent
        ? `\n\n⏰ Nächstes Ereignis: ${new Date(nextEvent.zeitpunkt).toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} (${nextEvent.titel})`
        : '';

      const message =
        `${event.emoji} *VOR 2000 JAHREN* - ${time.toLocaleString('de-DE', { weekday: 'long', hour: '2-digit', minute: '2-digit' })} Uhr\n\n` +
        `${event.text}\n\n` +
        `📖 Basierend auf ${event.bibelstelle}${nextText}`;

      users.forEach(chatId => {
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }).catch(() => users.delete(chatId));
      });
    });
  });
}

scheduleEvents();
console.log('✅ Bot gestartet');
