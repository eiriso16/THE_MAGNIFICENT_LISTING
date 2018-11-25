CREATE TABLE "Items" (
listid int,
name text NOT NULL,
checked BOOLEAN,
duedate text,
importance text DEFAULT 0,
tag text,
CONSTRAINT uc_items UNIQUE (name, listid),
FOREIGN KEY (listid) REFERENCES "Lists"(id)
)
