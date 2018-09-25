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

app.post("/api/user",function(req,res){
    //res.send("WOHO").end();
    
    let user = req.body;
    
    user.id = users.length +1;
    users.push(user);
    
    res.json(user).end();
})
