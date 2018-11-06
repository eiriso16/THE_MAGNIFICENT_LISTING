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
          name: formData.get("newName"),
          email: formData.get("newEmail"),
          password: formData.get("newPsw")
        })
      });
    let data = await response.json();
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

//-------------- Login user------------
/*let btnLogin = document.getElementById("login");
btnLogin.onclick = loginUser;

async function logInUser(email, password){

  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPsw").value;

  fetch("/app/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }).then(loginResponse).then(loginDisplay).catch(loginError);
}

//sql'en må sjekke om tilsvarende bruker finnes i databasen og returnere noe

function loginResponse(response){
  return response.json();
}

function loginDisplay(data){
  let loginRes = document.getElementById("loginResp");
  if(data.name){
    loginRes.innerHTML = "Welcome " + data.name;
  }
  else loginRes.innerHTML = "Wrong email or password";
}

function loginError(err){
  console.log(err);
}*/

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
