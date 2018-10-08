const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', (process.env.PORT ||8080));
app.use(express.static('public'));

app.use(bodyParser.json());
app.listen(app.get('port'), function(){
console.log('server running', app.get('port'));
});

const users = [];

//create user
app.post("/api/user",function(req,res){
	
	let user = req.body;
	let isUser = false;
	
	for(let i in users){
		if(user.email === users[i].email){
			isUser = true;
		}
	}
	
	if(!isUser){
		user.email = req.body.email;
		user.name = req.body.name;
		user.password = req.body.password;
		user.id = users.length + 1;
		users.push(user);
		res.json(user).end();
	}
	else
		res.json("User already exists, try another email address").end();
})

//user login
app.post("/api/login",function(req,res){
	
	let user = req.body;
	let name = "";
	//let foundUser = {};
	
	for(let i in users){
		if(user.email === users[i].email && user.password === users[i].password){
			name = users[i].name;
			//foundUser = users[i]; //bør ikke returnere passord??	
		}
	}
	
	res.json(name).end();
	//res.json(foundUser).end();
	
})
