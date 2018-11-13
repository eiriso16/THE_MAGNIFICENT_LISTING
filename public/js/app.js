"use strict"
let authUser = checkAuthentication();
view();
//---------create user-----------
function view(){
//  if(!authUser){
if(!checkAuthentication()){
    addTemplate("createUserTemplate");
    let userForm = document.getElementById("newUser");
    userForm.onsubmit = createUser;

  //  addTemplate("loginUserTemplate");
    let btnLogin = document.getElementById("login");
    btnLogin.onclick = loginUser;
  }
  else {
    addTemplate("listViewTemplate");
    let btnDel = document.getElementById("delete");
    btnDel.onclick = checkRole;

    let listForm = document.getElementById("createList");
    listForm.onsubmit = createList;

    let itemForm = document.getElementById("addItem");
    itemForm.onsubmit = addItem;

    let btnDelList = document.getElementById("btnDelList");
    btnDelList.onclick = deleteList;
  }
}

function addTemplate(templId){
  let container = document.getElementById("container");
  container.innerHTML = "";

  let templ = document.getElementById(templId);
  let clone = templ.content.cloneNode(true);
  container.appendChild(clone);

}

async function createUser(evt){
  evt.preventDefault();

  let username = document.getElementById("newUsername").value;
  let name = document.getElementById("newName").value;
  let email = document.getElementById("newEmail").value;
  let password = document.getElementById("newPsw").value;
  let userResp = document.getElementById("userResp");

  try {
    let response = await fetch("/app/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: password
      })
    });
    let data = await response.json();
    userResp.innerHTML = "User created with userid " + data[0].id;

  } catch(err){
    //  userResp.innerHTML = err;
    userResp.innerHTML = "Something went wrong: " + err;
    console.log(err);
  }
}

//-------------- Login user------------
//let btnLogin = document.getElementById("login");
//btnLogin.onclick = loginUser;

async function loginUser(){
  let username = document.getElementById("userName").value;
  let password = document.getElementById("userPsw").value;
  let loginRes = document.getElementById("loginResp");

  let response = await fetch("/app/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  let data = await response.json(); console.log(data);

  if(data.length === 1){
    loginRes.innerHTML = "Welcome " + data[0].name;
    localStorage.setItem("user", JSON.stringify(data[0]));
    localStorage.setItem("userId", data[0].id);
    view();
    //usersLists();
  }
  else {
    loginRes.innerHTML = "User not found";
  }
}

///todo denne knappen skal bort etterhvert
let chkAuth = document.getElementById("auth");
chkAuth.onclick = checkAuthentication;

function checkAuthentication(){
  let userId = localStorage.getItem("userId"); //fjerne??
  let currentList = localStorage.getItem("listId");
  let user =  JSON.parse(localStorage.getItem("user"));
  if(user){
    console.log("Current user: " + user.name + " current list: " + currentList);
    return true;
  }
  console.log("No user logged in");
  return false;
}

let btnLogout = document.getElementById("logout");
btnLogout.onclick = logOut;

function logOut(){
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("listId");
  view();
}

//---------- get all users -------------
//brukes ikke
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
//btnDel.onclick = checkRole;
//let deleteResp = document.getElementById("deleteResp");

function checkRole(){
  let idToDelete = document.getElementById("userId").value;
  let user = JSON.parse(localStorage.getItem("user"));

  ///todo bruker som sletter seg selv bør logges ut?
  if(user.role === 'admin' || user.id === parseInt(idToDelete)){
    delUser(idToDelete);
  }
  else deleteResp.innerHTML = 'Only admins can delete other users';
}

async function delUser(id){

  try {
    let response = await fetch(`app/deleteUser/${id}/`, {
      method: "DELETE"
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

//----------Create List-------------
//let listForm = document.getElementById("createList");
//listForm.onsubmit = createList;

async function createList(evt){
  evt.preventDefault();
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
        userId: localStorage.getItem("userId")
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
//let itemForm = document.getElementById("addItem");
//itemForm.onsubmit = addItem;

async function addItem(evt){
  evt.preventDefault();

  let item = document.getElementById("listItem").value;
  let itemResp = document.getElementById("itemResp");

  try {

    let url = 'app/list/item';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        itemName: item,
        listId: localStorage.getItem("listId")
      })
    });
    let data = await response.json(); console.log(data);

    if (data){
      itemResp.innerHTML = "Item added to List";
    }
    else{
      itemResp.innerHTML = "Something went wrong";
    }
  }
  catch(err){ //kommer ikke hit, hvorfor?
    //itemResp.innerHTML = "Something went wrong";
  }
}

//get users lists
/*async function usersLists(){
let lists = document.getElementById("myLists");
let userId = localStorage.getItem("userId");

try {
let response = await fetch(`app/list/${userId}/`);
let data = await response.json();  console.log(data);

if(data){
let span = document.createElement("span");
span.innerHTML = "Dine lister";
lists.appendChild(span);

for(let i in data){
let div = document.createElement("div");
div.id =  data[i].id;
div.innerHTML = data[i].name;
div.onclick = showList;
lists.appendChild(div);
}
}

} catch(err){
console.log(err);
}
}*/

//get list details (items in list)
async function showList(evt){
  let container = document.getElementById("itemsContainer");
  let listId = evt.currentTarget.id;
  localStorage.setItem("listId", listId);

  try {
    let response = await fetch(`app/list/items/${listId}`);
    let data = await response.json(); console.log(data);

    if(data){
      for(let i in data){
        let div = document.createElement("div");
        div.innerHTML = JSON.stringify(data[i]);
        container.appendChild(div);
      }
    }

  } catch(err) {
    console.log(err);
  }
}

// -----------delete list--------------
//btnDelList.onclick = deleteList;
//let delListResp = document.getElementById("delListResp");
async function deleteList(){
  let id = document.getElementById("delList").value;
  try {
    let response = await fetch(`app/deleteList/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    });
    let data = await response.json();
    if(data.length === 1){
      delListResp.innerHTML = "List " + data[0].id + " deleted";
    }
    else delListResp.innerHTML = "Something went wrong..";
  } catch(err){
    console.log(err);
  }
}

//delete all items in list (to be able to delete list)
//kalles foreløpig ikke
async function deleteAllItemsInList(){
  let listId = localStorage.getItem("listId");

  try {
    let response = await fetch(`app/list/deleteItems/${listId}`, {
      method: "DELETE"
    });
    let data = await response.json();
  } catch(err) {
    console.log(err);
  }

}
