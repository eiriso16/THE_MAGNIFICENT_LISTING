"use strict"
//let authUser = checkAuthentication();
let menu = document.getElementById("menu");
view();
//---------create user-----------
function view(){
  //  if(!authUser){
  if(!checkAuthentication()){
    addTemplate("userTemplate");
    let userForm = document.getElementById("newUser");
    userForm.onsubmit = createUser;

    let btnLogin = document.getElementById("login");
    btnLogin.onclick = loginUser;
    menu.style.display = "none";
  }
  else {
    addTemplate("listViewTemplate");

    let btnDel = document.getElementById("delete");
    btnDel.onclick = checkRole;

    let listForm = document.getElementById("createList");
    listForm.onsubmit = createList;
    menu.style.display = "";

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
    //  userResp.innerHTML = "User created with userid " + data[0].id;
    let userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = "Logged in user: " + data[0].name;
    localStorage.setItem("user", JSON.stringify(data[0]));
    localStorage.setItem("userId", data[0].id);
    view();
    usersLists();

  } catch(err){
    //  userResp.innerHTML = err;
    userResp.innerHTML = "Something went wrong: " + err;
    console.log(err);
  }
}

//-------------- Login user------------
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

  let data = await response.json();

  if(data.length === 1){
    let userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = "Logged in user: " + data[0].name;
    //  loginRes.innerHTML = "Welcome " + data[0].name;
    localStorage.setItem("user", JSON.stringify(data[0]));
    localStorage.setItem("userId", data[0].id);
    view();
    usersLists();
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
    console.log("Current user: " + userId + " current list: " + currentList);
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

let updUserBtn = document.getElementById("updUser");
updUser.onclick = updateUserInfo;

function updateUserInfo(){
  addTemplate("updateUserTemplate");
  let upd = document.getElementById("updUserSelect");
  upd.onclick = updUserColumn;
}

function updUserColumn(evt){
  let updSelect = document.getElementById("updUserSelect");
  updSelect.innerHTML ="";
  let update = document.getElementById("updateUser");

  let column = evt.target.id;
  let label = document.createElement("label");
  label.setAttribute("for", column);
  label.innerHTML = "Set new " + column;
  update.appendChild(label);

  let inp = document.createElement("input");
  inp.type = "text";
  inp.name = column;
  inp.id = "test";
  update.appendChild(inp);

  let btn = document.createElement("button");
  btn.innerHTML = "update";
  update.appendChild(btn);
  btn.id = column;
  btn.onclick = updateUser;
}

async function updateUser(evt){
  let newValue = document.getElementById("test").value;
  let column = evt.target.id;

  try {
    let response = await fetch("/app/user/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        userid: localStorage.getItem("userId"),
        column: column,
        value: newValue
      })
    });

    let data = await response.json(); console.log(data);
  } catch(err){

  }
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
      logOut();
    }
    else deleteResp.innerHTML = "Something went wrong..";

  } catch(err){
    console.log(err);
  }
}

//----------Create List-------------
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
      usersLists();
    }
    else{
      listResp.innerHTML = "Something went wrong";
    }

  } catch(err){
    console.log(err);
  }
}

//-----------Add Item-------------------
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
    let data = await response.json();

    if (data){
      itemResp.innerHTML = "Item added to List";
      showItems();
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
async function usersLists(){
  let lists = document.getElementById("myLists");
  lists.innerHTML = "";
  let userId = localStorage.getItem("userId");

  try {
    let response = await fetch(`app/list/${userId}/`);
    let data = await response.json(); console.log(data);
    let span = document.createElement("span");
    lists.appendChild(span);

    if(data.length>0){
      span.innerHTML = "Your lists";

      for(let i in data){
        let div = document.createElement("div");
        div.id =  data[i].id;
        div.innerHTML = data[i].name;
        div.onclick = showList;
        div.classList.add("listedLists");
        lists.appendChild(div);
      }
    }
    else {
      span.innerHTML = "You have no lists";
    }

  } catch(err){
    console.log(err);
  }
}

//show selected list
function showList(evt){
  addTemplate("listDetailsTemplate");
  let listId = evt.currentTarget.id;
  localStorage.setItem("listId", listId);

  let btnDelList = document.getElementById("btnDelList");
  btnDelList.onclick = deleteAllItemsInList;
  let itemForm = document.getElementById("addItem");
  itemForm.onsubmit = addItem;

  let listName = document.getElementById("currentList");
  listName.innerHTML = evt.currentTarget.innerHTML;

  showItems();

}

//show items in list
async function showItems(){
  let listId = localStorage.getItem("listId");
  let itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";

  try {
    let response = await fetch(`app/list/items/${listId}`);
    let data = await response.json();

    if(data){
      for(let i in data){
        let div = document.createElement("div");
        div.id = data[i].name;
        div.classList.add("listedItems");
        div.classList.add("importance" + data[i].importance);

        let label = document.createElement("label");
        label.setAttribute("for", data[i].name);
        label.innerHTML = data[i].name;
          
        let tagView = document.createElement("span");
        tagView.id = "tagView";
        tagView.innerHTML = data[i].tag;

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = data[i].name;
        if(data[i].checked){
          checkBox.checked = true;
        }
        checkBox.onclick = setChecked;

        let span = document.createElement("span");
        span.innerHTML = "x ";
        span.id = data[i].name;
        span.onclick = deleteItem;
          
          
        let update = document.createElement("span");
        update.innerHTML = "Update Tags ";
        update.id = data[i].name;
        update.onclick = itemDetails;
          
          
        let importance = document.createElement("span");
        importance.innerHTML = "Set Importance ";
        importance.id = data[i].name;
        importance.onclick = setImportance;

          
        let deadline = document.createElement("span");
        deadline.innerHTML = "Set Deadline ";
        deadline.id = data[i].name;
        deadline.title = data[i].duedate;
        let test = data[i].duedate;
        console.log(test);
        deadline.onclick = setDeadline;
          
        div.appendChild(label);
        div.appendChild(tagView);
        div.appendChild(checkBox);
        div.appendChild(span);
        div.appendChild(update);
        div.appendChild(importance);
        div.appendChild(deadline);
        itemsContainer.appendChild(div);
      }
    }

  } catch(err) {
    console.log(err);
  }
}

//------------------Checkbox----------------
async function setChecked(evt){
 let checked =evt.target.checked;
    
    let listId = localStorage.getItem("listId");
    let itemName = evt.target.parentElement.id;
    
    try {
        let url = 'app/list/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: checked,
        column: 'checked'
      })
    });
    let data = await response.json();
        
        showItems();
        
    }   
        catch(err){
        
        
    }
    
}

//------------------Update Item-------------
function itemDetails(evt){
    let inp = document.createElement("input");
    let inpBtn = document.createElement("button");
    
    inp.id ="tagInp";
    inpBtn.id ="tag";
    
    inpBtn.innerHTML="Tag Item";
    inpBtn.onclick = updateItem;
    
    evt.target.parentElement.appendChild(inp);
    evt.target.parentElement.appendChild(inpBtn);
}

async function updateItem(evt){
    let newValue = document.getElementById("tagInp").value;
    let column = evt.target.id;
    
    let listId = localStorage.getItem("listId");
    let itemName = evt.target.parentElement.id;
    
    try {
        let url = 'app/list/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: newValue,
        column: column
      })
    });
    let data = await response.json();
        
       removeInput();
        showItems();
        
    }   
        catch(err){
        
        
    }
    
}

//----------------------remove tag input----------------

function removeInput(){
    document.getElementById("tagInp").remove();
    document.getElementById("tag").remove();
}

//----------------item importance---------------------
function setImportance(evt){
    let imp1Btn = document.createElement("button");
    let imp2Btn = document.createElement("button");
    let imp3Btn = document.createElement("button");
    let imp4Btn = document.createElement("button");
    
    imp1Btn.id ="1"; //high
    imp2Btn.id ="2"; //medium
    imp3Btn.id ="3"; //low
    imp4Btn.id ="0";
    
    imp1Btn.innerHTML="High";
    imp2Btn.innerHTML="Medium";
    imp3Btn.innerHTML="Low";
    imp4Btn.innerHTML="None"
    
    imp1Btn.onclick = updateImp;
    imp2Btn.onclick = updateImp;
    imp3Btn.onclick = updateImp;
    imp4Btn.onclick = updateImp;
    
    evt.target.parentElement.appendChild(imp1Btn);
    evt.target.parentElement.appendChild(imp2Btn);
    evt.target.parentElement.appendChild(imp3Btn);
    evt.target.parentElement.appendChild(imp4Btn);
}

async function updateImp(evt){
    let importance = evt.target.id;
    
    let listId = localStorage.getItem("listId");
    let itemName = evt.target.parentElement.id;
    
    console.log(evt.target.parentElement);
    try {
        let url = 'app/list/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: importance,
        column: 'importance'
      })
    });
    let data = await response.json();
        
        showItems();
        
    }   
        catch(err){
        console.log(err);
        
    }
}

//----------------set deadline-------------------
function setDeadline(evt){
    let date = document.createElement("input");
    let dateBtn = document.createElement("button");
    
    date.type = "date";
    
    date.id ="dateInp";
    dateBtn.id ="date";
    
    dateBtn.innerHTML="Set Deadline";
    dateBtn.onclick = updateDeadline;
    
    evt.target.parentElement.appendChild(date);
    evt.target.parentElement.appendChild(dateBtn);
}

async function updateDeadline(evt){
    let date = document.getElementById("dateInp").value;
    
    let listId = localStorage.getItem("listId");
    let itemName = evt.target.parentElement.id;
    
    try {
        let url = 'app/list/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: date,
        column: 'duedate'
      })
    });
    let data = await response.json();
        
        showItems();
        
    }   
        catch(err){
        console.log(err);
        
    }
}

//delete one item in list
async function deleteItem(evt){
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.id;
  try {
    let response = await fetch(`/app/list/deleteItem/${listId}/${itemName}`, {
      method: "DELETE"
    });
    let data = await response.json();
    showItems();
  }
  catch(err){
    console.log(err);
  }
}

//delete all items in list (to be able to delete list)
async function deleteAllItemsInList(){
  let listId = localStorage.getItem("listId");

  try {
    let response = await fetch(`app/list/deleteItems/${listId}`, {
      method: "DELETE"
    });
    let data = await response.json();
    await deleteList();
    addTemplate("listViewTemplate");
    usersLists();
  } catch(err) {
    console.log(err);
  }

}


// -----------delete list--------------
async function deleteList(){
  //  let id = document.getElementById("delList").value;
  let id = localStorage.getItem("listId");
  let delListResp = document.getElementById("delListResp");
  try {
    let response = await fetch(`app/deleteList/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    });
    let data = await response.json();
    //kommer ikke hit?
    if(data.length === 1){
      localStorage.removeItem("listId");
      delListResp.innerHTML = "List " + data[0].id + " deleted";
    }
    else delListResp.innerHTML = "Something went wrong..";
  } catch(err){
    console.log(err);
  }
}

let backBtn = document.getElementById("allLists");
backBtn.onclick =allLists;

function allLists(){
  addTemplate("listViewTemplate");
  usersLists();
}
