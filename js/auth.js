const express = require('express')
const router = express.Router();
const db = require("./db.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY;

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

    let sql = `select id, username, name, email, role, password from public."Users"
    where "username" = '${username}';`

    try {
      let user = await db.runQuery(sql);
      if(user.length>0) {
        let correct = await bcrypt.compare(password, user[0].password)
        .then(function(res){
          return res;
        });

        if(correct){
          let token = jwt.sign({username: username}, TOKEN_KEY);

          delete user[0].password;

          res.status(200).send({user: user[0], token: token});
        }
        else {
          res.status(401).json({ message: "Wrong username or password" });
        }

      }
      else {
        res.status(401).json({ message: "Wrong username or password" });
      }

    } catch(err){
      res.status(500).json({ message: "Something went wrong" });

    }

  }

});

router.verifyToken = function(req, res, next){
  let token = req.headers['x-access-token'];

  jwt.verify(token, TOKEN_KEY, function(err) {
        if (err) {
          return res.status(401).json({message: 'Token is not valid'});
        } else {
          next();
        }
  });

}

router.crypt = async function(req, res, next){

  await bcrypt.hash(req.body.password, saltRounds, function(err, hashed){
    if (err) {
      return res.status(500).json({message: 'Something went wrong'});
    } else {
      req.hashed = hashed;
      next();
    }
  })

};

module.exports = router;
