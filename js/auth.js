const express = require('express')
const router = express.Router();
const db = require("./db.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY || 'thisisthemagnificentlocaltokenkey';

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
      if(user){
        let correct = await bcrypt.compare(password, user[0].password)
        .then(function(res){
          return res;
        });

        if(correct){

          let token = jwt.sign({username: username}, TOKEN_KEY);
          //verifyToken(token);
        //  console.log(token);
          //let decoded = jwt.verify(token, TOKEN_KEY);
          //let decoded = jwt.decode(token);
        //  console.log(decoded);

          delete user[0].password;
          res.status(200).send({user: user[0], token: token});
        }
        else {
          res.status(401).json({ message: "Wrong username or password" });
        }

      }

    } catch(err){
      res.status(500).json({ message: "Something went wrong" });

    }

  }

});

router.verifyToken = function(req, res, next){
  let token = req.headers['x-access-token'];

  //let decoded = jwt.decode(token);
  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) { console.log('error: ' + err); //JsonWebTokenError: invalid token
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded; //console.log(decoded);
          next();
        }
  });

}

module.exports = router;
