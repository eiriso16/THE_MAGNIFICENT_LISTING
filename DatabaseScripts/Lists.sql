CREATE TABLE "Lists" (
id serial PRIMARY KEY,
owner int,
name text NOT NULL,
done BOOLEAN,
tag text,
FOREIGN KEY (owner) REFERENCES "Users"(id)
)
