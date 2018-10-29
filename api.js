/* create user*/

METHOD: POST
ENDPOINT: app/user
BODY (json): {"name":"Mr.X", "email":"mrx@uia.no", "password":"123456"}
RESPONSE (json): {"id":123, "name":"Mr.X", "email":"mrx@uia.no", "password":"123456"}


/* login */

METHOD: POST
ENDPOINT: app/login
BODY (json): {"email":"mrx@uia.no", "password":"123456"}
//RESPONSE (json): {"email":"mrx@uia.no", "password":"123456"}
RESPONSE (json): {user}
//RESPONSE (json): name
