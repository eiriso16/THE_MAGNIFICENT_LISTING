const express = require('express')
const router = express.Router();
const db = require("./db.js");
const auth = require('./auth.js');

//---------- opprette ny bruker ----------
router.post('/app/user', auth.crypt, async function(req,res,next){

  let username = req.body.username;
  let fullName = req.body.name;
  let userEmail = req.body.email;
  let hashedPsw = req.hashed;

  let sql =  `insert into public."Users" ("username","name", "email", "password")
  values('${username}', '${fullName}', '${userEmail}', '${hashedPsw}')
  returning "id", "username", "name", "email", "role";`;

  try {
    let data = await db.runQuery(sql);

    if(data){
      res.status(200).json(data);

    } else {
        res.status(400).json({message: "not a unique username/email"});
    }
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- slette bruker ----------
router.delete('/app/deleteUser/:id/', auth.verifyToken, async function(req, res, next){

  let id = req.params.id;

  let sql = `delete from public."Users" where id = '${id}'
  returning username ;`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- oppdatere bruker ----------
router.post('/app/user/updateUser', auth.verifyToken, async function(req, res, next){

  let userId = req.body.userid;
  let column = req.body.column;
  let newValue = req.body.value;

  try {

    let sql = `update public."Users" set ${column} = '${newValue}'
    where id = '${userId}' returning name, username, email;`;

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

//---------- oppdatere brukers passord ----------
router.post('/app/user/updateUserPsw', auth.verifyToken, auth.crypt, async function(req, res, next){

  let userId = req.body.userid;
  let newValue = req.hashed;

  try {

    let sql = `update public."Users" set password = '${newValue}'
    where id = '${userId}' returning name, username, email;`;

    let data = await db.runQuery(sql);
    if(data){
      res.status(200).json(data[0]);
    }
    else {
      res.status(500).json({message: "something went wrong"});
    }
  }

  catch(err) {
    res.status(500).json({error: err});
  }

});


//---------- user metrics ----------
router.get('/app/userMetrics/:id/', auth.verifyToken, async function(req, res, next){

  let id = req.params.id;

  let sqlLists = `select count(*) as lists from public."Lists" l
  join public."Users" u on (l.owner = u.id and u.id = '${id}');`;

  let sqlItems = `select count(*) as items from public."Items" i
  join public."Lists" l on (i.listid = l.id)
  join public."Users" u on (l.owner = u.id and u.id = '${id}');`;

  try {
    let lists = await db.runQuery(sqlLists);
    let items = await db.runQuery(sqlItems);
    //res.status(200).json(lists);
    res.status(200).send({lists: lists[0].lists, items: items[0].items})
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

module.exports = router;
