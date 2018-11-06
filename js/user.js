const express = require('express')
const router = express.Router();
const db = require("./db.js");

//hente alle brukere fra databasen
router.get('/app/allUsers',async function(req,res,next){
  let sql = 'SELECT * FROM public."Users";';

  try {
    let users = await db.runQuery(sql);
    //console.log('innhold fra select-query i users.js: ' + JSON.stringify(users));
    res.status(200).json(JSON.stringify(users));
    //må ha enten next() eller end() ???
  }

  catch(err) {
    res.status(500).json({error: err});
  }
});

//opprette ny bruker i databasen
router.post('/app/user', async function(req,res,next){
  /// todo password-hashing
  let userName = req.body.name;
  let userEmail = req.body.email;
  let userPsw = req.body.password;

  /// todo bare returnere id?
  let sql =  `insert into public."Users" ("name", "email", "password")
   values('${userName}', '${userEmail}', '${userPsw}')
   returning "id", "name", "email", "password";`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data); //hvorfor er dette et array?
  }

  catch(err) {
    res.status(500).json({error: err});
  }
});

//slette bruker fra databasen
router.delete('/app/deleteUser/:id/', async function(req, res, next){

  let id = req.params.id;

  let sql = `delete from public."Users" where id = '${id}'
  returning id ;`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data); //hvorfor er dette et array?

  }

  catch(err) {
    res.status(500).json({error: err});
  }

});

module.exports = router;
