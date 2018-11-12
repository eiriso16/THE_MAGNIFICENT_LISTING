CREATE TABLE "Items" (
listid int,
name text NOT NULL,
checked BOOLEAN,
duedate DATE,
importance text,
tag text,
CONSTRAINT uc_items UNIQUE (name, listid),
FOREIGN KEY (listid) REFERENCES "Lists"(id)
)
