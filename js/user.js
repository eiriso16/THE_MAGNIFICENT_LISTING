const express = require('express')
const router = express.Router();
const db = require("./db.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//---------- opprette ny bruker ----------
router.post('/app/user', async function(req,res,next){
  /// todo password-hashing?
  let username = req.body.username;
  let fullName = req.body.name;
  let userEmail = req.body.email;
  let userPsw = req.body.password;

  /*bcrypt.hash(req.body.password, saltRounds).then(function(hashed){
    userPsw = hash;
  });*/


  let sql =  `insert into public."Users" ("username","name", "email", "password")
  values('${username}', '${fullName}', '${userEmail}', '${userPsw}')
  returning "id", "username", "name", "email", "role";`;

  try {
    let data = await db.runQuery(sql);
    let err = db.previousError(); //  console.log(err.detail);

    if(err){
      res.status(400).send(err.detail); //send(err)?
    } else {
      res.status(200).json(data);
    }
  }
  catch(err) {
    console.log("error fra user.js " + err);
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

//---------- oppdatere bruker ----------
router.post('/app/user/updateUser', async function(req, res, next){

  let userId = req.body.userid;
  let column = req.body.column;
  let newValue = req.body.value;

  let sql = `update public."Users" set ${column} = '${newValue}'
  where id = '${userId}' returning name, username, email;`;

  try {
    let data = await db.runQuery(sql);
    if(data){
      res.status(200).json(data[0]);
    }
    else {
      res.status(400).json({message: "not unique"})
    }
  }

  catch(err) {
    res.status(500).json({error: err});
  }

});

module.exports = router;
