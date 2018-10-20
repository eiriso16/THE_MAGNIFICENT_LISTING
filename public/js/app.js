"use strict"

//---------create user-----------
let elem1 = document.getElementById("elem1");
elem1.onclick = newUser;

function newUser(){
  elem1.classList.add("hidden");
  let newDiv= document.getElementById("new");
  newDiv.classList.remove("hidden");
  let btn = document.getElementById("newBtn");
  btn.onclick = henteData;
}

function henteData(){
  let newName = document.getElementById("newName").value;
  let newEmail = document.getElementById("newEmail").value;
  let newPsw = document.getElementById("newPsw").value;

  let validData = validation(newName, newEmail, newPsw);

  if(validData) {
    sendDataTilServer(newName, newEmail, newPsw);
  }
}

//checks input-data from user
function validation(name, email, psw){
  let response = document.getElementById("userResp");
  if(!nameTest(name)){
    response.innerHTML = "Name must be at least 2 characters";
  }
  else if(!emailTest(email)){
    response.innerHTML = "Not a valid e-mailadress";
  }
  else if(!passwordTest(psw)){
    response.innerHTML = "Password must be at least 6 characters";
  }
  else return true;
}

function nameTest(name){
  if(name.length > 1) {
    return true;
  }
}

function emailTest(email){
  let regex = /^[^\s]+@[^\s]+\.[^\s]+$/;
  return regex.test(email);
}

function passwordTest(psw){
  if(psw.length > 5){
    return true;
  }
}

function sendDataTilServer(name, email, password){

  fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password
    })
  }).then(newUserResponse).then(newUserDisplay).catch(newUserError);
}

function newUserResponse(response){
  return response.json();
}

//data inneholder res.json() fra server-fila
function newUserDisplay(data){

  let res = document.getElementById("userResp");
  if(typeof data === 'object'){

    res.innerHTML = "User created with userid " + data["id"];
  }
  else {
    res.innerHTML = data;
  }
}

function newUserError(err){
  res.innerHTML = "Something went wrong. Errormessage: " + err;
}


//-------------- Login user------------

let elem2 = document.getElementById("elem2");
elem2.onclick = loginUser;

function loginUser(){
  elem2.classList.add("hidden");
  let login = document.getElementById("divLogin");
  login.classList.remove("hidden");
  let btn = document.getElementById("login");
  btn.onclick = loginData;
}

function loginData() {
  let userEmail = document.getElementById("userEmail").value;
  let userPsw = document.getElementById("userPsw").value;
  logInUser(userEmail, userPsw);
}

function logInUser(email, password){

  fetch("/api/login", {
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
}
