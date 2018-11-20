const express = require('express')
const router = express.Router();
const db = require("./db.js");


router.get('/app/authenticate', async function(req, res, next){
  let authHeader = req.headers.authorization;

  if(!authHeader) {
    res.status(401).end();
  }
  else {
    let base64Credentials = req.headers.authorization.split(' ')[1];
    let buffer = Buffer.from(base64Credentials, 'base64');
    let credentials = buffer.toLocaleString();
    //let credentials = buffer.toString('utf-8'); //eller 'ascii' //æøå støttes ikke
    ///todo støtte for æøå??
    let username = credentials.split(':')[0];
    let password = credentials.split(':')[1];

    let sql = `select id, username, name, email, role from public."Users"
    where "username" = '${username}' and "password" = '${password}';`

    try {
      let data = await db.runQuery(sql);
      if(data.length === 1){
        res.status(200).json(data[0]);
      }
      else {
        res.status(401).json({ message: "Wrong username or password" });
      }

    } catch(err){
      res.status(500).json(err); //usikker på denne

    }

  }

});

module.exports = router;
