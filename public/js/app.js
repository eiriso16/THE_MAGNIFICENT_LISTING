"use strict"
let menu = document.getElementById("menu");
let userResponse = document.getElementById("userResponse");
view();

//display correct html
function view(){
  userResponse.innerHTML = "";
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

    let listForm = document.getElementById("createList");
    listForm.onsubmit = createList;
    menu.style.display = "";

    let user = JSON.parse(localStorage.getItem("user"));
    let userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = "Logged in user: " + user.name;

  }
}

//switching templates
function addTemplate(templId){
  let container = document.getElementById("container");
  container.innerHTML = "";

  let templ = document.getElementById(templId);
  let clone = templ.content.cloneNode(true);
  container.appendChild(clone);
}

//---------create user-----------
async function createUser(evt){
  evt.preventDefault();
  let username = document.getElementById("newUsername").value;
  let name = document.getElementById("newName").value;
  let email = document.getElementById("newEmail").value;
  let password = document.getElementById("newPsw").value;
  let createUserResp = document.getElementById("createUserResp");
  let okPassword = checkPassword(password);

  if(!okPassword){
  createUserResp.innerHTML = "password must be minimum 5 characters long";
  }
  else {

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
      if(response.status === 200 ){
        createUserResp.innerHTML = "User created, log in to proceed";
      }
      else if (response.status === 400){
        createUserResp.innerHTML = data.message;
      }

    } catch(err){
      createUserResp.innerHTML = "Something went wrong: " + err;
      console.log(err);
    }
  }
}

function checkPassword(password){
  return password.length>4;
}

//-------------- Login user------------
async function loginUser(){
  let username = document.getElementById("userName").value;
  let password = document.getElementById("userPsw").value;
  let userResp = document.getElementById("userResp");

  let credentials = `Basic ${ btoa(username + ":" + password)}`;
  try{
    let response = await fetch("/app/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": credentials
      }
    });
    let data = await response.json();
    if(response.status === 200){
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      userResp.innerHTML = "";
      view();
      usersLists();

    }
    else if(response.status === 401){
      userResp.innerHTML = data.message;
    }
    else if(response.status === 500){
      userResp.innerHTML = data.message;
    }
  }
  catch(error) {
    console.log(error);
  }
}

function checkAuthentication(){
  let user = JSON.parse(localStorage.getItem("user"));

  if(user){
    return true;
  }
  return false;
}

let btnLogout = document.getElementById("logout");
btnLogout.onclick = logOut;

function logOut(){
  localStorage.removeItem("user");
  localStorage.removeItem("listId");
  localStorage.removeItem("token");
  view();
}

let updUserBtn = document.getElementById("updUser");
updUser.onclick = updateUserInfo;

function updateUserInfo(){
  addTemplate("updateUserTemplate");
  let upd = document.getElementById("updUserSelect");
  upd.onclick = updUserColumn;

  let btnDel = document.getElementById("delete");
  btnDel.onclick = deleting;
}

function updUserColumn(evt){
  let updSelect = document.getElementById("updUserSelect");
  updSelect.innerHTML = "";
  let update = document.getElementById("updateUser");

  let column = evt.target.id;
  let label = document.createElement("label");
  label.setAttribute("for", column);
  label.innerHTML = "Set new " + column;
  label.classList.add("settingInf");
  update.appendChild(label);

  let inp = document.createElement("input");
  inp.type = "text";
  inp.name = column;
  inp.id = "newVal";
  update.appendChild(inp);

  let btn = document.createElement("button");
  btn.innerHTML = "update";
  update.appendChild(btn);
  btn.id = column;
  btn.classList.add("settingBtn");
  if(column === 'password'){
    btn.onclick = updateUserPsw;
  }
  else btn.onclick = updateUser;
}

//update users name, email, username
async function updateUser(evt){
  let newValue = document.getElementById("newVal").value;
  let column = evt.target.id;
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch("/app/user/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        userid: user.id,
        column: column,
        value: newValue
      })
    });

    let data = await response.json();
    if(response.status === 200){
      userResponse.innerHTML = "new " + column + ": " + data[column];
    }
    else if(response.status === 400){
      userResponse.innerHTML = column + " " + data.message;
    }
    else if(response.status === 401){
      userResponse.innerHTML = data.message;
    }

  } catch(err){
    userResponse.innerHTML = "Something went wrong";
  }
}

//update users password
async function updateUserPsw(){

  let newValue = document.getElementById("newVal").value;
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch("/app/user/updateUserPsw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        userid: user.id,
        password: newValue
      })
    });

    let data = await response.json();
    if(response.status === 200){
      userResponse.innerHTML = "password updated";
    }
    else if(response.status === 401){
      userResponse.innerHTML = data.message;
    }

  } catch(err){
    userResponse.innerHTML = "Something went wrong";
  }

}

async function deleting(){
  let delUser =  window.confirm("Are you sure? Deleting your account will also delete all your lists");
  if(delUser){
    await deleteUsersLists();
    await deleteUser();
  }

}

// ---------- delete users lists ----------
async function deleteUsersLists(){
  let user = JSON.parse(localStorage.getItem("user"));
  try {
    let response = await fetch(`app/list/deleteAllLists/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
    });

    let data = await response.json();

  } catch(err){
    console.log(err);
  }

}

// --------- delete user ------------
async function deleteUser(){
  let user = JSON.parse(localStorage.getItem("user"));
  try {
    let response = await fetch(`app/user/deleteUser/${user.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
    });

    let data = await response.json();
    if(data.length === 1){
      userResponse.innerHTML = "User " + data[0].username + " deleted";
      logOut();
    }
    else userResponse.innerHTML = "Something went wrong..";

  } catch(err){
    console.log(err);
  }
}

// ---------- user metrics ----------
let btnMetrics = document.getElementById("metrics");
btnMetrics.onclick = showMetrics;

async function showMetrics(){
  addTemplate("userMetricsTemplate");
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch(`app/user/metrics/${user.id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });

    let data = await response.json();
    if(data[0]){
      showOutput(data[0]);
    }
  } catch(err){

  }

}

//display user metrics
function showOutput(data){
  let container = document.getElementById("userMetrics");
  container.classList.add("metricTitle");
  let output = document.createElement("div");
  output.classList.add("metricOutput");
  container.appendChild(output);

  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let div3 = document.createElement("div");
  let div4 = document.createElement("div");

  div1.innerHTML = "Total lists: " + data.lists;
  div2.innerHTML = "Total items in all lists: " + data.items;
  div3.innerHTML = "Shared lists: " + data.sharedlists;
  div4.innerHTML = "Done lists: " + data.donelists;

  output.appendChild(div1);
  output.appendChild(div2);
  output.appendChild(div3);
  output.appendChild(div4);
}

//----------Create List-------------
async function createList(evt){
  evt.preventDefault();
  let listname = document.getElementById("listName").value;
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let url = 'app/list';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listName: listname,
        userId: user.id
      })
    });
    let data = await response.json();

    let listResp = document.getElementById("listResp");

    if (data.length === 1){
      listResp.innerHTML = "List created";
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

    let url = 'app/item';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
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
  localStorage.removeItem("listId");
  let user =  JSON.parse(localStorage.getItem("user"));
  userResponse.innerHTML = "";

  try {
    let response = await fetch(`app/list/${user.id}/`, {
      method:"GET",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();
    let span = document.createElement("span");
    lists.appendChild(span);

    if(data.length>0){
      span.innerHTML = "YOUR LISTS";
      span.id = "listHeader";

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

  let btnUpdList = document.getElementById("btnUpdList");
  btnUpdList.onclick = updListName;

  let btnShareList = document.getElementById("btnShareList");
  btnShareList.onclick = shareListStart;

  let btnTagList = document.getElementById("btnTagList");
  btnTagList.onclick = dropdownOpen;


  showItems();

}

//edit listname
function updListName(evt){
  let input = document.createElement("input");
  let button = document.createElement("button");

  input.id = "newVal";
  button.innerHTML = "Update name";
  button.id = "name";
  button.classList.add("settingBtn");
  button.onclick = updateListName;

  evt.target.parentElement.appendChild(input);
  evt.target.parentElement.appendChild(button);
}

async function updateListName(evt){
  let newValue = document.getElementById("newVal").value;
  let column = evt.target.id;
  let listId = localStorage.getItem("listId");

  try {
    let url = 'app/list/updateList';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        newvalue: newValue,
        column: column
      })
    });
    let data = await response.json();
    if(data){
      document.getElementById("currentList").innerHTML = data.name;
    }
    else {
      userResponse.innerHTML = "Something went wrong";
    }

    removeInput("newVal", "name");

  }
  catch(err){
    console.log(err);
  }

}

//sharing of lists
function shareListStart(evt){
  let input = document.createElement("input");
  let button = document.createElement("button");

  input.id = "newVal";
  input.placeholder = "add username";
  button.innerHTML = "Share list";
  button.id = "shareduser";
  button.classList.add("settingBtn");
  button.onclick = shareList;

  evt.target.parentElement.appendChild(input);
  evt.target.parentElement.appendChild(button);
}

async function shareList(){
  let username = document.getElementById("newVal").value;
  let listId = localStorage.getItem("listId");
  let listResp = document.getElementById("itemResp");

  try {
    let response = await fetch('app/list/shareList', {
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        username: username
      })
    });
    let data = await response.json();
    if(data){
      listResp.innerHTML =  data.name + " shared with " + username;
    }
    else {
      listResp.innerHTML = "Something went wrong";
    }

    removeInput("newVal", "shareduser");
  }
  catch(err){

  }
}

let unique_tags = [];

//show items in list
async function showItems(){
  let listId = localStorage.getItem("listId");
  let itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";
  unique_tags = [];

  try {
    let response = await fetch(`app/items/${listId}`, {
      method: "GET",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();

    if(data){
      let checkCounter = 0;
      let alertMessage = "";
      let tags = [];
      for(let i in data){
        let div = document.createElement("div");
        div.id = data[i].name;
        div.classList.add("listedItems");
        div.classList.add("importance" + data[i].importance);

        let label = document.createElement("label");
        label.setAttribute("for", data[i].name);
        label.innerHTML = data[i].name;
        label.classList.add("itemlistName");

        let tagView = document.createElement("span");
        tagView.innerHTML = data[i].tag;
        tagView.classList.add("itemTag");
        if(data[i].tag){
          tags.push(data[i].tag);
        }

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = data[i].name;
        if(data[i].checked){
          checkBox.checked = true;
          checkCounter++;
        }
        checkBox.style.cursor = "pointer";
        checkBox.classList.add("itemBox");
        checkBox.onclick = setChecked;

        let del = document.createElement("img");
        del.src = "../images/x.png";
        del.style.width = "20px";
        del.style.height = "auto";
        del.style.cursor = "pointer";
        del.id = data[i].name;
        del.title = "Delete item";
        del.style.cursor = "pointer";
        del.classList.add("itemlistDel");
        del.onclick = deleteItem;

        let update = document.createElement("img");
        update.src = "../images/hash3.png";
        update.style.width = "25px";
        update.style.height = "auto";
        update.id = data[i].name;
        update.title = "Tag item";
        update.style.cursor = "pointer";
        update.classList.add("itemlistUpd");
        update.onclick = itemDetails;

        let importance = document.createElement("img");
        importance.src = "../images/!!!.png";
        importance.style.width = "35px";
        importance.style.height = "auto";
        importance.title = "Set Importance ";
        importance.id = data[i].name;
        importance.style.cursor = "pointer";
        importance.classList.add("itemlistImp");
        importance.onclick = setImportance;

        let deadline = document.createElement("img");
        deadline.src = "../images/dead.png";
        deadline.style.width = "35px";
        deadline.style.height = "auto";
        deadline.style.cursor = "pointer";
        deadline.id = data[i].name;
        if(data[i].duedate){
          deadline.title = data[i].duedate;
        }else {
          deadline.title = "Set deadline";
        }
        deadline.classList.add("itemDeadl");
        deadline.onclick = setDeadline;

        div.appendChild(label);
        div.appendChild(checkBox);
        div.appendChild(tagView);
        div.appendChild(del);
        div.appendChild(deadline);
        div.appendChild(importance);
        div.appendChild(update);
        itemsContainer.appendChild(div);

        if(data[i].duedate){
          alertMessage += checkDueDate(data[i].duedate, data[i].name);
        }
      }

      if (alertMessage){
        alert (alertMessage);
      }

      if(checkCounter === data.length){
        setListDone(listId, true);
      }
      else {
        setListDone(listId, false);
      }

      for (let i in tags) {
        if (unique_tags.indexOf(tags[i]) === -1) {
          unique_tags.push(tags[i]);
        }
      }
    }

  } catch(err) {
    console.log(err);
  }
}

function dropdownOpen() {
  let tagContainer = document.getElementById("dropTags");
  tagContainer.innerHTML = "";
  let showAllTags = document.createElement("p");
  showAllTags.id="showAll";
  showAllTags.innerHTML="Show all";
  showAllTags.onclick = filterTags;
  tagContainer.appendChild(showAllTags);
  for (let i in unique_tags){
    let p = document.createElement("p");
    p.id = unique_tags[i];
    p.onclick = filterTags;
    p.innerHTML = unique_tags[i];
    tagContainer.appendChild(p);
  }
  tagContainer.classList.toggle("show");
}

function filterTags(evt){
  let test = document.querySelectorAll(".itemTag");
  for (let i in test){
  if(evt.target.id === "showAll" && test[i].parentElement){
    test[i].parentElement.style.display = "";
  }

  else if (test[i].innerHTML === evt.target.id){
      test[i].parentElement.style.display = "";
    }
    else if(test[i].parentElement){
      test[i].parentElement.style.display = "none";
    }

  }

}

//lukke dropdown ved å trykke hvor som helst i vinduet
window.onclick = function(event) {
  if (!event.target.matches('.cssBtn')) {

    let dropdowns = document.getElementsByClassName("dropMenu");
    //console.log("dropdown" + dropdowns);
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


//---------------deadline alert-------------------
function checkDueDate(duedate, name){
  let x = new Date();
  let year = x.getFullYear();
  let month = x.getMonth() + 1;
  let date = x.getDate();
  let today = year + "-" + month + "-" + date;

  let alertMessage = "";

  if (duedate === today)
  {
    alertMessage = "You have met the deadline for: " + name + "\n";
  }
  else if(duedate < today){
    alertMessage = "You have passed the deadline for: " + name + "\n";
  }

  return alertMessage;
}

//Updates done-status for list
async function setListDone(listId, done){
  try {
    let url = 'app/list/updateList';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        newvalue: done,
        column: "done"
      })
    });
    let data = await response.json();
    if(data.done){
      document.getElementById("currentList").classList.add("listDone");
    }
    else {
      document.getElementById("currentList").classList.remove("listDone");
    }

  }
  catch(err){
    console.log(err);
  }

}

//------------------Checkbox----------------
async function setChecked(evt){
  let checked =evt.target.checked;
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.parentElement.id;

  try {
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
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

if(document.getElementById("tagInp")){
  removeInput("tagInp", "tag");
}

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
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: newValue,
        column: column
      })
    });
    let data = await response.json();

    removeInput("tagInp", "tag");
    showItems();

  }
  catch(err){

  }

}

// remove xtra input fields
function removeInput(elem1, elem2){
  document.getElementById(elem1).remove();
  document.getElementById(elem2).remove();

}

//----------------item importance---------------------
function setImportance(evt){
  if(document.getElementById("0")){
    removeInput("0", "1");
    removeInput("2", "3");
  }

  let imp1Btn = document.createElement("button");
  let imp2Btn = document.createElement("button");
  let imp3Btn = document.createElement("button");
  let imp4Btn = document.createElement("button");

  imp1Btn.id ="3"; //high
  imp2Btn.id ="2"; //medium
  imp3Btn.id ="1"; //low
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

  try {
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
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

  if(document.getElementById("dateInp")){
    removeInput("dateInp", "date");
  }

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
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
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
    let response = await fetch(`/app/item/deleteItem/${listId}/${itemName}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
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
    let response = await fetch(`app/item/deleteItems/${listId}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();
    await deleteList();
    view();
    usersLists();
  } catch(err) {
    console.log(err);
  }

}

// -----------delete list--------------
async function deleteList(){
  let id = localStorage.getItem("listId");
  let delListResp = document.getElementById("delListResp");
  try {
    let response = await fetch(`app/list/deleteList/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();

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
  view();
  usersLists();
}
