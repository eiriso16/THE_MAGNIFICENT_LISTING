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

module.exports = router;