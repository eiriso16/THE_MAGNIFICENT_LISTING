const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const router = express.Router();
const db = require("./js/db.js");
const user = require("./js/user.js");

app.set('port', (process.env.PORT ||8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(user);

app.listen(app.get('port'), function(){
	console.log('server running', app.get('port'));
});

const users = [];

//------ user login ------
app.post("/app/login",function(req,res){

	let user = req.body;
	let name = "";
	let foundUser = {};

	for(let i in users){
		if(user.email === users[i].email && user.password === users[i].password){
			//	name = users[i].name;
			foundUser = users[i]; //bør ikke returnere passordet
		}
	}

	//	res.json(name).end();
	res.json(foundUser).end();

})
