const express = require('express')
const router = express.Router();
const db = require("./db.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const auth = require('./auth.js')

//---------- opprette ny bruker ----------
router.post('/app/user', async function(req,res,next){
  /// todo password-hashing?
  let username = req.body.username;
  let fullName = req.body.name;
  let userEmail = req.body.email;
  let userPsw = req.body.password;

  let hashedPsw = await bcrypt.hash(req.body.password, saltRounds)
  .then(function(hash){
    return hash;
  });

  let sql =  `insert into public."Users" ("username","name", "email", "password")
  values('${username}', '${fullName}', '${userEmail}', '${hashedPsw}')
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
router.post('/app/user/updateUser', auth.verifyToken, async function(req, res, next){

  let userId = req.body.userid;
  let column = req.body.column;
  let newValue = req.body.value;

  try {

    if(column === 'password'){
      newValue = await bcrypt.hash(req.body.value, saltRounds)
      .then(function(hash){
        console.log(hash);
        return hash;
      });
    }

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

//---------- user metrics ----------
router.get('/app/userMetrics/:id/', async function(req, res, next){

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
