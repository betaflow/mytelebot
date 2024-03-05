class Database {
	constructor(databaseConnection) {
		this.db = databaseConnection;
	}

	async getSetting(settingName) {
		return await this.db.prepare("SELECT value FROM settings WHERE name = ?")
			.bind(settingName)
			.first('value');
	}

	async getLatestUpdateId() {
		let result = await this.db.prepare("SELECT updateId FROM messages ORDER BY updateId DESC LIMIT 1")
			.first('updateId');
		
		return Number(result);
	}

		async checkStatus(chat_id) {
		return await this.db.prepare("SELECT status FROM users WHERE chat_id = ?")
			.bind(chat_id)
			.first('status');
	}
	
		async checkLevel(chat_id) {
		return await this.db.prepare("SELECT level FROM users WHERE chat_id = ?")
			.bind(chat_id)
			.first('level');
	}
		async setStatus(chat_id, settingValue) {
		return await this.db.prepare(
			`INSERT 
				INTO users (status)
				VALUES (?)
					WHERE chat_id = ?`
		  )
			.bind(settingValue, chat_id)
			.run();
	}
	

		async setUser(chat_id) {
		return await this.db.prepare(
			`INSERT 
				INTO users (chat_id, username, frirtname, lastname, status, level)
				VALUES (?, ?, ?, ?, "home", 1)
				ON CONFLICT(chat_id) DO UPDATE SET
					firstName = excluded.firstName,
					lastName = excluded.lastName,
					username = excluded.username,
					WHERE excluded.chat_id <> users.chat_id`
		  )
			.bind(chat_id, user.username||null,user.first_name||null, user.last_name)
			.run();
	}

	async getUser(telegramId) {
		return await this.db.prepare("SELECT * FROM users WHERE telegramId = ?")
			.bind(telegramId)
			.first();
	}

	async saveUser(user, authTimestamp) {
		console.log(user);
		console.log(authTimestamp);
		// the following is an upsert, see https://sqlite.org/lang_upsert.html for more info
		return await this.db.prepare(
			`INSERT 
				INTO users (createdDate, updatedDate, lastAuthTimestamp, 
					telegramId, isBot, firstName, lastName, username, languageCode,
					isPremium, addedToAttachmentMenu, allowsWriteToPm, photoUrl                  
					)
				VALUES (DATETIME('now'), DATETIME('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON CONFLICT(telegramId) DO UPDATE SET
					updatedDate = DATETIME('now'),
					lastAuthTimestamp = COALESCE(excluded.lastAuthTimestamp, lastAuthTimestamp),
					isBot = COALESCE(excluded.isBot, isBot),
					firstName = excluded.firstName,
					lastName = excluded.lastName,
					username = excluded.username,
					languageCode = COALESCE(excluded.languageCode, languageCode),
					isPremium = COALESCE(excluded.isPremium, isPremium),
					addedToAttachmentMenu = COALESCE(excluded.addedToAttachmentMenu, addedToAttachmentMenu),
					allowsWriteToPm = COALESCE(excluded.allowsWriteToPm, allowsWriteToPm),
					photoUrl = COALESCE(excluded.photoUrl, photoUrl)
					WHERE excluded.lastAuthTimestamp > users.lastAuthTimestamp`
		  )
			.bind(authTimestamp, 
				user.id, +user.is_bot, user.first_name||null, user.last_name||null, user.username||null, user.language_code||null,
				+user.is_premium, +user.added_to_attachment_menu, +user.allows_write_to_pm, user.photo_url||null
				)
			.run();
	}

}
export { Database }
