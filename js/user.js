const express = require('express')
const router = express.Router();
const db = require("./db.js");

//---------- hente alle brukere ----------
router.get('/app/allUsers',async function(req,res,next){
  let sql = 'select * from public."Users";';

  try {
    let users = await db.runQuery(sql);
    res.status(200).json(JSON.stringify(users));
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- opprette ny bruker ----------
router.post('/app/user', async function(req,res,next){
  /// todo password-hashing?
  let username = req.body.username;
  let fullName = req.body.name;
  let userEmail = req.body.email;
  let userPsw = req.body.password;

  let sql =  `insert into public."Users" ("username","name", "email", "password")
   values('${username}', '${fullName}', '${userEmail}', '${userPsw}')
   returning "id", "username", "name", "email", "role";`;

  try {
    let data = await db.runQuery(sql);

    let err = (db.previousError);
    if(err){
      // DB spørringen virket ikke
      res.status(400).send(err).end();
    } else{
      // Ny bruker i databasaen
        res.status(200).json(data);
    }
console.log();


  }

  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- logge inn ----------
router.post("/app/login", async function(req,res){

  let username = req.body.username;
  let password = req.body.password;

  let sql = `select id, username, name, email, role from public."Users" where "username" = '${username}'
   and "password" = '${password}';`

  try {
	let data = await db.runQuery(sql);
	res.status(200).json(data);
	//hva returneres hvis den ikke finner bruker?

  } catch(err){
	res.status(500).json({error: err});
  }

});

//---------- slette bruker ----------
router.delete('/app/deleteUser/:id/', async function(req, res, next){

  let id = req.params.id;

  let sql = `delete from public."Users" where id = '${id}'
  returning id ;`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

module.exports = router;
