/* --------------------- Auth ------------------ */

/* login user */
METHOD: GET
ENDPOINT: /app/authenticate
BODY (json): {"email": string, "password": string}
RESPONSE (json): {"id": integer, "username": string, "name": string, "email": string, "role": string}


/* --------------------- User ------------------ */

/* create user*/
METHOD: POST
ENDPOINT: /app/user
BODY (json): {"name": string, "email": string, "password": string}
RESPONSE (json): {"id": integer, "name": string, "email": string}

/* delete user */
METHOD: DELETE
ENDPOINT: /app/deleteUser/:id/
PARAMS ??
RESPONSE (json): {"id:" integer}

/* update user */
METHOD: POST
ENDPONT: /app/user/updateUser
BODY (json): {"userid": string, "column": string, "value": string}
RESPONSE (json):

/* ------------------------- List ------------------------ */

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

/* delte list */
METHOD: DELETE
ENDPOINT: /app/deleteUser/:id/
