const express = require('express')
const router = express.Router();
const db = require("./db.js");
const auth = require('./auth.js');

//---------- opprette liste ----------
router.post('/app/list', auth.verifyToken, async function(req,res,next){
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
router.post('/app/list/item', auth.verifyToken, async function(req,res,next){
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
router.get('/app/list/:owner/', auth.verifyToken, async function(req,res,next){

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
router.get('/app/list/items/:listid', auth.verifyToken, async function(req,res,next){

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

//---------- delete one list ----------
router.delete('/app/deleteList/:id/', auth.verifyToken, async function(req, res, next){
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
router.delete('/app/list/deleteItem/:listId/:itemName', auth.verifyToken, async function(req, res, next){

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
router.delete('/app/list/deleteItems/:listid', auth.verifyToken, async function(req,res,next){

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
router.post('/app/list/item/updateItem', auth.verifyToken, async function(req,res,next){
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
router.post('/app/list/updateList', auth.verifyToken, async function(req,res,next){
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

router.delete('/app/list/deleteAllLists/:userid', auth.verifyToken, async function(req, res, next){
  let userid = req.params.userid;

  let sqlItems = `delete from public."Items" i
                  where exists (select 1 from public."Lists" l
				           where l.owner = '${userid}' and l.id = i.listid)
                   returning *;`;

  let sqlLists = `delete from public."Lists" where owner = '${userid}'
                  returning *;`;

  try {
    let items = await db.runQuery(sqlItems);
    let lists = await db.runQuery(sqlLists);
    res.status(200).send({items, lists});
  }
  catch(err) {
    res.status(500).json({error: err});
  }
});


module.exports = router;
