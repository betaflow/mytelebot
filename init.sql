CREATE TABLE IF NOT EXISTS users (
	chat_id integer UNIQUE NOT NULL,
	username text,
	firstName text,
	lastName text,
	status text,
	level integer
);
CREATE TABLE IF NOT EXISTS tcsp (
	ma_sp integer UNIQUE NOT NULL,
	ten_sp text,
	db_id text
);
