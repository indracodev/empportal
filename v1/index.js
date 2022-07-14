hashCheck();
function hashCheck(){
  if(localStorage.getItem("empportalhash") === null){
    generateHash();
  } else {
    validateHash();
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
          closeLoad();
          console.log(result);
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            var hashstatres = resultParse.hashstat.status;
            if(hashstatres == "Guest"){
              window.location = "login/";
            } else if(hashstatres == "Logged In"){
              window.location = "dashboard/";
            } else if(hashstatres == "Logged Out"){
              alert("You are logged out");
              localStorage.removeItem("empportalhash");
              setTimeout(function(){
                window.location.reload();
              }, 2000);
            } else {
              alert("Error! Unidentified Status!");
            }
          } else {
            if(resultParse.message === "Sorry! your session has expired!"){
              setTimeout(function(){
                generateHash();
              }, 2000);
            } else if(resultParse.message === "Device changing! reload app or refresh this page"){
              setTimeout(function(){
                generateHash();
              }, 2000);
            } else {
              alert(resultMessage);
            }
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
