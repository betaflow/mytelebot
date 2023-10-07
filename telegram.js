const TELEGRAM_API_BASE_URL = 'https://api.telegram.org/bot';

class TelegramAPI {
    constructor(token) {
        this.token = token;
        this.apiBaseUrl = `${TELEGRAM_API_BASE_URL}${token}/`;
    }

    async sendMessage(chatId, text, parse_mode, reply_to_message_id) {
        const url = `${this.apiBaseUrl}sendMessage`;
        const params = {
            chat_id: chatId,
            text: text,
        };
        if (parse_mode) {
            params.parse_mode = parse_mode;
        }
        if (reply_to_message_id) {
            params.reply_to_message_id = reply_to_message_id;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        return response.json();
    }

    async setWebhook(externalUrl, secretToken) {
        const params = {
            url: externalUrl,
        };
        if (secretToken) {
            params.secret_token = secretToken;
        }
        const url = `${this.apiBaseUrl}setWebhook`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        return response.json();
    }
}

export { TelegramAPI as Telegram }