CREATE TABLE IF NOT EXISTS users (
	id integer PRIMARY KEY AUTOINCREMENT,
	chat_id integer UNIQUE NOT NULL,
	username text,
	isBot integer,
	firstName text,
	lastName text,
	level text
);
