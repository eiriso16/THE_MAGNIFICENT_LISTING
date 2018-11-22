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

//---------- delete list ----------
router.delete('/app/deleteList/:id/', async function(req, res, next){
  let id = req.params.id;
  let sql = `delete from public."Lists" where id = '${id}'
  returning id ;`;
  try {
    let data = await db.runQuery(sql);
    res.status(200).json(data);
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

//---------- delete item in list ----------
router.delete('/app/list/deleteItem/:listId/:itemName', async function(req, res, next){

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

//---------- update item ----------
router.post('/app/list/item/updateItem', async function(req,res,next){
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

//---------- update list ----------
router.post('/app/list/updateList', async function(req,res,next){
    let listId = req.body.listid;
    let column = req.body.column;
    let newValue = req.body.newvalue;

    let sql = `update public."Lists" set ${column} = '${newValue}'
    where id = '${listId}' returning name, done;`;

try {
    let data = await db.runQuery(sql);
    res.status(200).json(data[0]);
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});

module.exports = router;
