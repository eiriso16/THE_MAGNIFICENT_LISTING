/* --------------------- Auth ------------------ */

/* login user */
METHOD: GET
ENDPOINT: /app/authenticate
BODY (json): {"email": string, "password": string}
RESPONSE (json): {user{"id": int, "username": string, "name": string,
"email": string, "role": string}, token{"token": string}}

/* --------------------- User ------------------ */

/* create user*/
METHOD: POST
ENDPOINT: /app/user
BODY (json): {"username": string, "name": string, "email": string, "password": string}
RESPONSE (json): {"id": int, "username": string, "name": string, "email": string, "role": string}

/* delete user */
METHOD: DELETE
ENDPOINT: /app/user/deleteUser/:id/
PARAMS: int userid
RESPONSE (json): {"username:" string}

/* update user */
METHOD: POST
ENDPONT: /app/user/updateUser
BODY (json): {"userid": int, "column": string, "value": string}
RESPONSE (json): {"username": string, "name": string, "email": string}

/* update users password */
METHOD: POST
ENDPOINT: /app/user/updateUserPsw
BODY (json): {"userid": int, "password": string}
RESPONSE (json): {"username": string, "name": string, "email": string}

/* user metrics */
METHOD: GET
ENDPOINT: /app/user/metrics/:id/
PARAMS: int userid
RESPONSE (json): {"lists": int, "items": int, "sharedlists": int, "donelists": int}

/* ------------------------- List ------------------------ */

/* create list */
METHOD: POST
ENDPOINT: /app/list
BODY (json): {"listName": string, "userId": int}
RESPONSE (json): {"id": int, "name": string}

/* get users lists */
METHOD: GET
ENDPOINT: /app/list/:owner/
PARAMS: int owner
RESPONSE (json): {"id": int, "owner": int, "name": string, "done": boolean}

/* update list */
METHOD: POST
ENDPOINT: /app/list/updateList
BODY (json): {"listid": int, "column": string, "newvalue": string}
RESPONSE: {"name": string, "done": boolean}

/* share list */
METHOD: POST
ENDPOINT: /app/list/shareList
BODY (json): {"listid": int, "username": string}
RESPONSE (json): {"name": string}

/* delete list */
METHOD: DELETE
ENDPOINT: /app/list/deleteList/:id/
PARAMS: int listid
RESPONSE (json): {"id": int}

/* delete all lists */
METHOD: DELETE
ENDPOINT: /app/list/deleteAllLists/:userid
PARAMS: int userid
RESPONSE (json): {"items": [{items}], "lists": [{lists}]}


/* ------------------------- Item ------------------------ */

/* create item */
METHOD: POST
ENDPOINT: /app/item
BODY (json): {"itemName": string, "listId": int}
RESPONSE (json): {"name": string}

/* get all items in list */
METHOD: GET
ENDPOINT: /app/items/:listid
PARAMS: int listid
RESPONSE (json): {"listid": int, "name": string, "checked": boolean,
"duedate": string, "importance": string, "tag": string}

/* delete one item */
METHOD: DELETE
ENDPOINT: /app/item/deleteItem/:listId/:itemName
PARAMS: int listId, string itemName
RESPONSE:

/* delete all items in a list*/
METHOD: DELETE
ENDPOINT: /app/item/deleteItems/:listid
PARAMS: int listid
RESPONSE:

/* update item */
METHOD: POST
ENDPOINT: /app/item/updateItem
BODY (json): {"listid": int, "name": string, "column": string, "newvalue": string}
RESPONSE:
