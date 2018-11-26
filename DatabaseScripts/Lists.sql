CREATE TABLE "Lists" (
id serial PRIMARY KEY,
owner int,
name text NOT NULL,
done BOOLEAN,
shareduser int,
FOREIGN KEY (owner) REFERENCES "Users"(id)
)
