const express = require('express')
const router = express.Router();
const db = require("./db.js");

//---------- opprette liste ----------
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
});

//---------- add item to list ----------
router.post('/app/list/item',async function(req,res,next){
    let itemName = req.body.itemName;
    let listId = req.body.listId;

    let sql = `insert into public."Items" ("name", "listid")
   values('${itemName}', '${listId}')
   returning "name";`;

    try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }

  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- get users lists ----------
router.get('/app/list/:owner/', async function(req,res,next){

  let userId = req.params.owner;
  let sql = `select * from public."Lists" where owner = '${userId}'`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

//---------- get items in list ----------
router.get('/app/list/items/:listid', async function(req,res,next){

  let listId = req.params.listid;
  let sql = `select * from public."Items" where listid = '${listId}';`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

//---------- delete all items in list -----------
router.delete('/app/list/deleteItems/:listid', async function(req,res,next){

  let listId = req.params.listid;
  let sql = `delete from public."Items" where listid = '${listId}';`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

module.exports = router;
