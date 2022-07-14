var webdir = "http://192.168.1.92/empportal/";
var apidir = "http://192.168.1.92/empportal/portalapi/v1/";
var imgdir = "http://192.168.1.92/empportal/portalapi/v1/asset/";

function closeLoad(){
  var loadscreen = document.getElementById("loadscreen");
  var loadscreencore = document.getElementById("loadscreencore");
  loadscreen.style.opacity = "0";
  loadscreen.style.visibility = "hidden";
  loadscreencore.style.transform = "translateY(50px)";
}

function showMsg(text){
  var message = document.getElementById("message");
  var messagecore = document.getElementById("messagecore");
  var messagemsg = document.getElementById("messagemsg");
  message.style.opacity = "1";
  message.style.visibility = "visible";
  messagecore.style.transform = "translateY(0px)";
  if(text != ""){
    messagemsg.innerHTML = text;
  }
}

function closeMsg(){
  var message = document.getElementById("message");
  var messagecore = document.getElementById("messagecore");
  var messagemsg = document.getElementById("messagemsg");
  message.style.opacity = "0";
  message.style.visibility = "hidden";
  messagecore.style.transform = "translateY(-50px)";
  setTimeout(function(){
    document.getElementById("messagecore").innerHTML = `
      <div class="message_core_logo" id="messagelogo">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="message_core_text" id="messagemsg">
        An error has found!
      </div>
      <div class="message_core_button" id="messagebtn">
        <button onclick='closeMsg()'><i class="bi bi-x-lg"></i> Close</button>
      </div>
    `;
  }, 500);
}

var userpop = "hide";
function userPop(){
  var navbaruser = document.getElementById("navbaruser");
  if(userpop == "show"){
    userpop = "hide";
  } else {
    userpop = "show";
  }
  if(userpop == "show"){
    navbaruser.style.border = "solid 2px orange";
  } else {
    navbaruser.style.border = "solid 2px #1B1A17";
  }
  var popuser = document.getElementById("popuser");
  if(userpop === "hide"){
    popuser.style.opacity = "0";
    popuser.style.visibility = "hidden";
    popuser.style.transform = "translateX(50px)";
  } else if(userpop === "show"){
    popuser.style.opacity = "1";
    popuser.style.visibility = "visible";
    popuser.style.transform = "translateX(0px)";
  }
}

var menupop = "hide";
function menuPop(){
  var navbarmenu = document.getElementById("navbarmenu");
  var navbarmoduletitle = document.getElementById("navbarmoduletitle");
  var navbaruser = document.getElementById("navbaruser");
  if(menupop == "show"){
    menupop = "hide";
  } else {
    menupop = "show";
  }
  if(menupop == "show"){
    navbarmenu.style.color = "orange";
    navbarmoduletitle.style.color = "white";
    navbaruser.style.border = "solid 2px white";
  } else {
    navbarmenu.style.color = "#1B1A17";
    navbarmoduletitle.style.color = "#1B1A17";
    navbaruser.style.border = "solid 2px #1B1A17";
  }
  var popmenu = document.getElementById("popmenu");
  var popmenucore = document.getElementById("popmenucore");
  var popmenucoretitle = document.getElementById("popmenucoretitle");
  var popmenucorelist = document.getElementById("popmenucorelist");
  if(menupop == "hide"){
    popmenu.style.opacity = "0";
    popmenu.style.visibility = "hidden";
    popmenucore.style.transform = "translateY(-80px)";
    popmenucore.style.bottom = "300px";
    popmenucore.style.right = "100px";
    popmenucore.style.borderRadius = "10px 10px 500px 100px";
    popmenucoretitle.style.transform = "translateY(-80px)";
    popmenucorelist.style.opacity = "0";
  } else {
    popmenu.style.opacity = "1";
    popmenu.style.visibility = "visible";
    popmenucore.style.transform = "translateY(0px)";
    popmenucore.style.bottom = "10px";
    popmenucore.style.right = "10px";
    popmenucore.style.borderRadius = "10px 10px 10px 10px";
    popmenucoretitle.style.transform = "translateY(0px)";
    popmenucorelist.style.opacity = "1";
  }
}

hashCheck();
function hashCheck(){
  if(localStorage.getItem("empportalhash") === null) {
    window.location = "../";
  } else {
    validateHash();
  }
}

function validateHash(){
  var portalhash = localStorage.getItem("empportalhash");
  var useragent = navigator.userAgent;
  if(portalhash == ""){
    alert("Unsupported browser for localstorage");
  } else {
    try{
      $.ajax({
        url: apidir + 'hashing.php?do=status',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          agent : useragent
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            var hashstatres = resultParse.hashstat.status;
            if(hashstatres != "Logged In"){
              window.location = "../";
            }
            navUserInit();
          } else {
            alert(resultMessage);
            setTimeout(function(){
              window.location = "../";
            }, 1000);
          }
        },
        error: function(error){
            console.log(error);
        }
      });
    } catch(e){
      console.log(e);
    }
  }
}

function navUserInit(){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    alert("Session not found!");
  } else {
    try{
      $.ajax({
        url: apidir + 'core.php?do=navbar',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            var respp = resultParse.navbardata.profilepict;
            if(respp != null){
              var popuserpp = document.getElementById("popuserpp");
              var navbaruser = document.getElementById("navbaruser");
              var urlassembly = `url("${apidir + respp}")`;
              popuserpp.style.backgroundImage = urlassembly;
              navbaruser.style.backgroundImage = urlassembly;
            }
            document.getElementById("popuserusername").innerHTML = resultParse.navbardata.nickname;
            document.getElementById("popuserrole").innerHTML = resultParse.navbardata.rolename;
          } else {
            console.log(resultMessage);
          }
        },
        error: function(error){
            console.log(error);
        }
      });
    } catch(e){
      console.log(e);
    }
  }
}

function showLogout(){
  userPop();
  var logout = document.getElementById("logout");
  var logoutcore = document.getElementById("logoutcore");
  logout.style.opacity = "1";
  logout.style.visibility = "visible";
  logoutcore.style.transform = "translateY(0px)";
}

function closeLogout(){
  userPop();
  var logout = document.getElementById("logout");
  var logoutcore = document.getElementById("logoutcore");
  logout.style.opacity = "0";
  logout.style.visibility = "hidden";
  logoutcore.style.transform = "translateY(-50px)";
}

function doLogout(){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash === ""){
    showMsg("Action is not available right now");
  } else {
    try{
      $.ajax({
        url: apidir + 'core.php?do=logout',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            closeLogout();
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-lock-fill"></i>`;
            document.getElementById("messagemsg").innerHTML = resultMessage;
            var message = document.getElementById("message");
            var messagecore = document.getElementById("messagecore");
            var messagemsg = document.getElementById("messagemsg");
            message.style.opacity = "1";
            message.style.visibility = "visible";
            messagecore.style.transform = "translateY(0px)";
            localStorage.removeItem("empportalhash");
            userPop();
            setTimeout(function(){
              window.location = "../";
            }, 2000);
          } else {
            showMsg(resultMessage);
          }
        },
        error: function(error){
            console.log(error);
        }
      });
    } catch(e){
      console.log(e);
    }
  }
}

function printModuleName(){
  var navbarmoduletitle = document.getElementById("navbarmoduletitle");
  navbarmoduletitle.innerHTML = modulelogo + " " + modulename;
}

printAppList();
function printAppList(){
  var popmenucorelist = document.getElementById("popmenucorelist");
  popmenucorelist.innerHTML = `
    <div class="navbar_menu_section">
      Content
    </div>
    <div onclick='goToModule("newsletter")' class="navbar_menu_app">
      <div class="navbar_menu_app_logo">
        <i class="bi bi-envelope-open-heart-fill"></i>
      </div>
      <div class="navbar_menu_app_title">
        Newsletter
      </div>
    </div>
    <div class="navbar_menu_app">
      <div class="navbar_menu_app_logo">
        <i class="bi bi-newspaper"></i>
      </div>
      <div class="navbar_menu_app_title">
        Article
      </div>
    </div>
    <div class="navbar_menu_app">
      <div class="navbar_menu_app_logo">
        <i class="bi bi-image-fill"></i>
      </div>
      <div class="navbar_menu_app_title">
        Galery
      </div>
    </div>
  `;
}

function gotoSetting(){
  window.location = "../setting/";
}

function goToModule(module){
  if(module == ""){
    alert("Module name is empty!");
  } else {
    var assemblydirectory = "../" + module + "/";
    window.location = assemblydirectory;
  }
}
