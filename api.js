/* --------------------- Users ------------------ */

/* create user*/
METHOD: POST
ENDPOINT: /app/user
BODY (json): {"name": string, "email": string, "password": string}
RESPONSE (json): {"id": integer, "name": string, "email": string}

/* login user */
METHOD: POST
ENDPOINT: /app/login
BODY (json): {"email": string, "password": string}
RESPONSE (json): {user} //hva er riktig retur her?

/* get all users */
METHOD: GET
ENDPOINT: /app/allUsers
RESPONSE (json): array with user-objects

/* delete user */
METHOD: DELETE
ENDPOINT: /app/deleteUser/:id/
PARAMS ??
RESPONSE (json): {"id:" integer}

/* ------------------------- Lists ------------------------ */

/* create list */
METHOD: POST
ENDPOINT: /app/list

/* add item */
METHOD: POST
ENDPOINT: /app/list/item

/* users lists */
METHOD: GET
ENDPOINT: /app/list/:owner/

/* items in list */
METHOD: GET
ENDPOINT: /app/list/items/:listid

/* delete all items in list*/
METHOD: DELETE
ENDPOINT: /app/list/deleteItems/:listid
