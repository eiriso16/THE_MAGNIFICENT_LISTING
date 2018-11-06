
CREATE TABLE "Items" (
itemid int PRIMARY KEY,
listid int,
name text NOT NULL,
checked BOOLEAN,
duedate DATE,
importance text,
tag text,
FOREIGN KEY (listid) REFERENCES "Lists"(id)
)
