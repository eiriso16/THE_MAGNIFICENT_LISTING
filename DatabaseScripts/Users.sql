-- table definition
 
 CREATE TABLE "Users" (
 
	id serial PRIMARY KEY,
	name text NOT NULL,
	email text NOT NULL,
	password text NOT NULL,
	role text DEFAULT 'user'
 )