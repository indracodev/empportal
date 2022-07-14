hashCheck();
function hashCheck(){
  if(localStorage.getItem("empportalhash") === null) {
    generateHash();
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
            if(hashstatres == "Guest"){
              closeLoad();
              setTimeout(function(){
                showForm();
              }, 500);
            } else if(hashstatres == "Logged In"){
              window.location = "../dashboard/";
            } else if(hashstatres == "Logged Out"){
              alert("You are logged out");
              localStorage.removeItem("empportalhash");
              setTimeout(function(){
                window.location.reload();
              }, 5000);
            } else {
              alert("Error! Unidentified Status!");
            }
          } else {
            alert(resultMessage);
            generateHash();
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

function generateHash(){
  var useragent = navigator.userAgent;
  if(useragent === ""){
    alert("Unsupported browser or device");
  } else {
    try{
      $.ajax({
        url: apidir + 'hashing.php?do=generate',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          agent : useragent
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            console.log(resultMessage);
            var hashres = resultParse.hash.code;
            localStorage.setItem("empportalhash", hashres);
            validateHash();
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

function showForm(){
  var loginform = document.getElementById("loginform");
  loginform.style.opacity = "1";
  loginform.style.visibility = "visible";
  loginform.style.transform = "translateY(0px)";
}

function submitLogin(){
  var portalhash = localStorage.getItem("empportalhash");
  var username = document.getElementById("loginusername").value;
  var password = document.getElementById("loginpassword").value;
  if(portalhash === ""){
    showMsg("No security key not found!");
  } else if(username === ""){
    showMsg("Username cannot be empty");
  } else if(password === ""){
    showMsg("Password cannot be empty");
  } else {
    try{
      $.ajax({
        url: apidir + 'login.php?do=check',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          username : username,
          password : password
        },
        success: function(result){
          console.log(result);
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagecore").innerHTML = `
              <div class="message_core_logo" id="messagelogo" style="color:darkgreen;">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="message_core_text" id="messagemsg">
                ${resultMessage}
              </div>
              <div class="message_core_button" id="messagebtn">
                <button onclick='closeMsg()'>Go To Dashboard</button>
              </div>
            `;
            var message = document.getElementById("message");
            var messagecore = document.getElementById("messagecore");
            var messagemsg = document.getElementById("messagemsg");
            message.style.opacity = "1";
            message.style.visibility = "visible";
            messagecore.style.transform = "translateY(0px)";
            setTimeout(function(){
              window.location = "../dashboard/";
            }, 3000);
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
