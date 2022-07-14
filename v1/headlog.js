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
