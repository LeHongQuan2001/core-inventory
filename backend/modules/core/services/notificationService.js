const configs = require('../../../configs/configs')

let token = configs.notification.token,
    chatId = configs.notification.chatId,
    notificationEnable = configs.notification.enable === 'true' ? true : false,
    appName = configs.app.name;
const TelegramBot = require('node-telegram-bot-api');

const notificationService = {
    send: async (message, configs = null) => {
        if (configs) {
            appName = configs.appName || token,
            token = configs.token || token,
            chatId = configs.chatId || chatId,
            notificationEnable = configs.enable || notificationEnable;
        }

        if (notificationEnable === true) {
            const bot = new TelegramBot(token, { polling: false });
            try {
                const msg = `[${appName}]\n${message}`;
                await bot.sendMessage(chatId, msg, {
                    parse_mode: ''
                });
            } catch (err) {
                console.log('Something went wrong when trying to send a Telegram notification', err);
            }
        }
    }
}

module.exports = notificationService
