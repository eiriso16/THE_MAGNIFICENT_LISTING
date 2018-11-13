const express = require('express')
const router = express.Router();
const db = require("./db.js");

router.post('/app/list',async function(req,res,next){
    let listName = req.body.listName;
    let owner = req.body.userId;
    
    let sql = `insert into public."Lists" ("name", "owner")
   values('${listName}', '${owner}')
   returning "id", "name";`;

    try {
    let data = await db.runQuery(sql);
    res.status(200).json(data); 
  }

  catch(err) {
    res.status(500).json({error: err});
  }
})

router.post('/app/list/item',async function(req,res,next){
    let itemName = req.body.itemName;
    let listId = req.body.listId;
    let itemId = req.body.itemId;
    
    let sql = `insert into public."Items" ("name", "listid", "itemid")
   values('${itemName}', '${listId}', '${itemId}')
   returning "itemid", "name";`;

    try {
    let data = await db.runQuery(sql);
    res.status(200).json(data); 
  }

  catch(err) {
    res.status(500).json({error: err});
  }
})

//slette liste fra databasen
router.delete('/app/deleteList/:id/', async function(req, res, next){

  let id = req.params.id;

  let sql = `delete from public."Lists" where id = '${id}'
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