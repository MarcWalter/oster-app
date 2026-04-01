import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import chokidar from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;
const bot = new TelegramBot(token, { polling: true });
const users = new Set();
const stateFile = './preview-state.json';

let events = JSON.parse(readFileSync('../content/ereignisse.json', 'utf8'));
let state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : {};

function hash(text) {
  return createHash('sha256').update(text).digest('hex');
}

function saveState() {
  writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function sendPreview(event) {
  if (!adminChatId) return;

  const message = `📋 *VORSCHAU* - Ereignis in 24h\n\n` +
    `${event.emoji} *${event.titel}*\n\n` +
    `⏰ ${new Date(event.zeitpunkt).toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}\n\n` +
    `${event.text_lang}\n\n` +
    `📖 ${event.bibelstelle}`;

  bot.sendMessage(adminChatId, message, { parse_mode: 'Markdown' });

  state[event.id] = {
    previewSent: true,
    contentHash: hash(event.text_lang),
    sentAt: new Date().toISOString()
  };
  saveState();
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);
  console.log(`User subscribed: ${chatId}`);
  bot.sendMessage(chatId,
    '🕊️ *Willkommen zur Oster-App!*\n\n' +
    'Erlebe die Ereignisse der Karwoche in Echtzeit.\n\n' +
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
    `${next.text_lang}\n\n` +
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
    const eventTime = new Date(event.zeitpunkt);
    const previewTime = new Date(eventTime.getTime() - 24 * 60 * 60 * 1000);

    const previewCron = `${previewTime.getMinutes()} ${previewTime.getHours()} ${previewTime.getDate()} ${previewTime.getMonth() + 1} *`;
    cron.schedule(previewCron, () => sendPreview(event));

    const eventCron = `${eventTime.getMinutes()} ${eventTime.getHours()} ${eventTime.getDate()} ${eventTime.getMonth() + 1} *`;
    cron.schedule(eventCron, () => {
      const now = new Date();
      const nextEvent = events.find(e => new Date(e.zeitpunkt) > now);
      const nextText = nextEvent
        ? `\n\n⏰ Nächstes Ereignis: ${new Date(nextEvent.zeitpunkt).toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} (${nextEvent.titel})`
        : '';

      const message =
        `${event.emoji} *VOR 2000 JAHREN* - ${eventTime.toLocaleString('de-DE', { weekday: 'long', hour: '2-digit', minute: '2-digit' })} Uhr\n\n` +
        `${event.text_lang}\n\n` +
        `📖 Basierend auf ${event.bibelstelle}${nextText}`;

      users.forEach(chatId => {
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }).catch(() => users.delete(chatId));
      });
    });
  });
}

chokidar.watch('../content/ereignisse.json').on('change', () => {
  const newEvents = JSON.parse(readFileSync('../content/ereignisse.json', 'utf8'));
  const now = new Date();

  newEvents.forEach(event => {
    const eventTime = new Date(event.zeitpunkt);
    const diff = eventTime - now;
    const within24h = diff > 0 && diff < 24 * 60 * 60 * 1000;

    if (within24h) {
      const newHash = hash(event.text_lang);
      const oldHash = state[event.id]?.contentHash;

      if (state[event.id]?.previewSent && newHash !== oldHash) {
        sendPreview(event);
      }
    }
  });

  events = newEvents;
});

scheduleEvents();
console.log('✅ Bot gestartet');
console.log(`Admin Chat ID: ${adminChatId || 'NICHT GESETZT'}`);
