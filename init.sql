CREATE TABLE IF NOT EXISTS users (
	chat_id integer UNIQUE NOT NULL,
	username text,
	firstName text,
	lastName text,
	status text,
	level integer
);
