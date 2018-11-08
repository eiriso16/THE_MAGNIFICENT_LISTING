"use strict"

//---------create user-----------
let btnNew = document.getElementById("newBtn");
btnNew.onclick = createUser;
let userResp = document.getElementById("userResp");

async function createUser(evt){
  evt.preventDefault();
  let userForm = document.getElementById("newUser");
  let formData = new FormData(userForm);

  try {
    let response = await fetch("/app/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: formData.get("newUsername"),
          name: formData.get("newName"),
          email: formData.get("newEmail"),
          password: formData.get("newPsw")
        })
      });
    let data = await response.json();
      console.log(data);
    if(data){
      userResp.innerHTML = "User created with userid " + data[0].id;
    }
    else {
        userResp.innerHTML = "Something went wrong";
    }
  } catch(err){
    console.log(err);
  }

}

//----------Create List-------------

let btnListCreate = document.getElementById("listBtn");
btnListCreate.onclick = createList;

async function createList(){
    let listname = document.getElementById("listName").value;
    
    try {
    let url = 'app/list';
    let response = await fetch(url,{
    method:"POST",
    headers:{
    "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
        listName: listname,
        userId: localStorage.getItem("auth")
      })                           
    });
    let data = await response.json(); console.log(data);

    let listResp = document.getElementById("listResp");    
        
    if (data.length === 1){
        listResp.innerHTML = "List created with id " + data[0].id;
        localStorage.setItem("listId",data[0].id);
    }
        else{
            listResp.innerHTML = "Something went wrong";
        }
        
  } catch(err){
    console.log(err);
  }
}

//-----------Add Item-------------------

let btnAddItem = document.getElementById("itemBtn");
btnAddItem.onclick = addItem;

async function addItem(){
    
    let item = document.getElementById("listItem").value;
    
    try {
        
        let url = 'app/list/item'; //lage ny
    let response = await fetch(url,{
    method:"POST",
    headers:{
    "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
        itemName: item,
        listId: localStorage.getItem("listId"),
        itemId: 1///todo fjerne hardkoding
      })                           
    });
    let data = await response.json(); console.log(data);

    let itemResp = document.getElementById("itemResp");    
        
    if (data.length === 1){
        itemResp.innerHTML = "Item added to List";
    }
        else{
            itemResp.innerHTML = "Something went wrong";
        }
    }
    catch(err){
        
    }
}

//---------- get all users -------------
let btnDb = document.getElementById("dbdata");
btnDb.onclick = dbData;

async function dbData(){

  try {
    let url = 'app/allUsers';
    let response = await fetch(url);
    let data = await response.json(); console.log(data);

  } catch(err){
    console.log(err);
  }

}

// --------- delete user ------------
let btnDel = document.getElementById("delete");
btnDel.onclick = delUser;
let deleteResp = document.getElementById("deleteResp");

///todo sjekke admin? eller bare vise slette-knapp for admin-brukere?
async function delUser(){
  let id = document.getElementById("userId").value;

  try {
    let response = await fetch(`app/deleteUser/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    });

    let data = await response.json();
    if(data.length === 1){
      deleteResp.innerHTML = "User " + data[0].id + " deleted";
    }
    else deleteResp.innerHTML = "Something went wrong..";

  } catch(err){
    console.log(err);
  }

}

//-------------- Login user------------
let btnLogin = document.getElementById("login");
btnLogin.onclick = loginUser;

let chkAuth = document.getElementById("auth");
chkAuth.onclick = checkAuthentication;

let btnLogout = document.getElementById("logout");
btnLogout.onclick = logOut;

function checkAuthentication(){
  let auth = localStorage.getItem("auth");
  console.log(auth);
  return auth;
}

function logOut(){
  localStorage.removeItem("auth");
}

async function loginUser(){

  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPsw").value;
  let loginRes = document.getElementById("loginResp");

  let response = await fetch("/app/login", {
	method: "POST",
	headers: {
  	"Content-Type": "application/json; charset=utf-8",
	},
	body: JSON.stringify({
  	email: email,
  	password: password
	})
  });

  let data = await response.json(); console.log(data);

  if(data.length === 1){
	loginRes.innerHTML = "Welcome " + data[0].name;
	localStorage.setItem("auth", data[0].id);
  }
  else {
	loginRes.innerHTML = "User not found";
  }

}
