import TelegramBot from 'node-telegram-bot-api';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

export const initTelegramBot = () => {
  if (!token) {
    console.warn('⚠️ Telegram Bot Token missing, skipping initialization.');
    return;
  }

  // Polling enabled
  bot = new TelegramBot(token, { polling: true });

  console.log('✅ Telegram Bot listener initialized.');

  // Listen for the /start <userId> command via deep link
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = match[1]; // The payload behind ?start=

    try {
      const user = await User.findById(userId);
      if (!user) {
        return bot.sendMessage(chatId, '❌ Identity not recognized. Ensure you clicked the link directly from your Kanban board.');
      }

      user.telegramChatId = chatId.toString();
      await user.save();

      bot.sendMessage(chatId, `✅ Successfully linked your NovaKanban account, ${user.username}! You will now receive automatic notifications here when your tasks are approaching their due dates.`);
    } catch (error) {
      console.error('Telegram Link Error:', error);
      bot.sendMessage(chatId, '❌ Server error while attempting to link your account. Please try again later.');
    }
  });

  bot.on('polling_error', (error) => {
    // Suppress common connection resets which the bot auto-recovers from
    if (error.code !== 'EFATAL' && !error.message.includes('ECONNRESET')) {
      console.error('Telegram Polling Error:', error.message);
    }
  });
};

export const sendTelegramNotification = (chatId, message) => {
  if (bot && chatId) {
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
      .catch(err => console.error('Failed to send telegram message:', err));
  }
};
