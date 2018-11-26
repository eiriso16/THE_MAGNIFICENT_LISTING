const express = require('express')
const router = express.Router();
const db = require("./db.js");
const auth = require('./auth.js');


//---------- create item ----------
router.post('/app/item', auth.verifyToken, async function(req,res,next){
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

//---------- get all items in list ----------
router.get('/app/items/:listid', auth.verifyToken, async function(req,res,next){

  let listId = req.params.listid;
  let sql = `select * from public."Items" where listid = '${listId}'
  order by importance desc;`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

//---------- delete item ----------
router.delete('/app/item/deleteItem/:listId/:itemName', auth.verifyToken, async function(req, res, next){

  let listId = req.params.listId;
  let itemName = req.params.itemName;
  let sql = `delete from public."Items" where listid = '${listId}' and name = '${itemName}';`;

  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});

//---------- delete all items in a list -----------
router.delete('/app/item/deleteItems/:listid', auth.verifyToken, async function(req,res,next){

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

//---------- update item ----------
router.post('/app/item/updateItem', auth.verifyToken, async function(req,res,next){
    let listId = req.body.listid;
    let itemName = req.body.name;
    let column = req.body.column;
    let newValue = req.body.newvalue;

    let sql = `update public."Items" set ${column} = '${newValue}' where listid = '${listId}' and name = '${itemName}';`;

try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

module.exports = router;
