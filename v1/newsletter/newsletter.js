//Default
var modulelogo = `<i class="bi bi-envelope-open-heart-fill"></i>`;
var modulename = `Newsletter`;
printModuleName();

//Data Variables
var datajson = ``;
var pagenow = 1;
var paginationlimit = 10;
var pagetotal = 0;

//Custom
goToSub("contact");

function goToSub(submod){
  pagenow = 1;
  if(submod == ""){
    alert("Not listed sub module");
  } else {
    document.getElementById("modulecontact").style.display = "none";
    document.getElementById("modulesource").style.display = "none";
    document.getElementById("modulemedia").style.display = "none";
    document.getElementById("modulecontent").style.display = "none";
    document.getElementById("moduleblasting").style.display = "none";
    var assemblyid = "module" + submod;
    var divtarget = document.getElementById(assemblyid);
    divtarget.style.display = "inline-block";
    if(submod === "contact"){
      getEmailSourceList();
    } else if(submod === "source"){
      getSourceList();
    } else if(submod === "media"){
      getMediaList();
    } else if(submod === "content"){
      getContentList();
    } else if(submod === "blasting"){

    } else {

    }
  }
}

function printPagination(){
  var resultParse = JSON.parse(datajson);
  var dataHTML = ``;
  var dataLength = resultParse.length;
  if(dataLength >= 1){
    if(dataLength == 1){
      document.getElementById("totaldata").innerHTML = `Result Data : 1`;
    } else {
      document.getElementById("totaldata").innerHTML = `Result Datas : ${dataLength}`;
    }
    var pagetotalraw = dataLength / paginationlimit;
    var pagetotals = Math.ceil(pagetotalraw);
    pagetotal = pagetotals;
    if(pagenow == 1){
      var paginationHTML = `
      <button style="color:lightgrey;" id="paginationbtnfirst"><i class="bi bi-chevron-double-left"></i></button>
      <button style="color:lightgrey;" id="paginationbtnprev"><i class="bi bi-chevron-left"></i></button>
      `;
    } else {
      var paginationHTML = `
      <button onclick='goToFirst()' style="color:#1B1A17;" id="paginationbtnfirst"><i class="bi bi-chevron-double-left"></i></button>
      <button onclick='goToPrev()' style="color:#1B1A17;" id="paginationbtnprev"><i class="bi bi-chevron-left"></i></button>
      `;
    }
    var paginationpid = 1;
    while(paginationpid <= pagetotals){
      if(paginationpid == 1){
        var paginationpagebtnCache = `
          <button onclick='goToPage("${paginationpid}")' style="color:#1B1A17;" id="paginationpage${paginationpid}">${paginationpid}</button>
        `;
      } else {
        var paginationpagebtnCache = `
          <button onclick='goToPage("${paginationpid}")' style="color:#1B1A17;" id="paginationpage${paginationpid}">${paginationpid}</button>
        `;
      }
      paginationHTML = paginationHTML + paginationpagebtnCache;
      paginationpid++;
    }
    if(pagetotal == 1 || pagenow == pagetotal){
      paginationHTML = paginationHTML + `
      <button style="color:lightgrey;" id="paginationbtnnext"><i class="bi bi-chevron-right"></i></button>
      <button style="color:lightgrey;" id="paginationbtnlast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    } else {
      paginationHTML = paginationHTML + `
      <button onclick='goToNext()' style="color:#1B1A17;" id="paginationbtnnext"><i class="bi bi-chevron-right"></i></button>
      <button onclick='goToLast()' style="color:#1B1A17;" id="paginationbtnlast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    }
    document.getElementById("paginationlist").innerHTML = paginationHTML;
    var activatepagenow = "paginationpage" + pagenow;
    document.getElementById(activatepagenow).style.backgroundColor = "rgba(0,0,0,.1)";
  } else {
    document.getElementById("paginationlist").innerHTML = "";
    document.getElementById("totaldata").innerHTML = `Result Data : 0`;
    var datalist = document.getElementById("datalist");
    datalist.innerHTML = `<i class="bi bi-emoji-frown-fill"></i> Empty Result`;
  }
}

function goToFirst(){
  var targetPage = 1;
  goToPage(targetPage);
}

function goToPrev(){
  var targetPage = pagenow - 1;
  goToPage(targetPage);
}

function goToNext(){
  var targetPage = pagenow + 1;
  goToPage(targetPage);
}

function goToLast(){
  var targetPage = pagetotal;
  goToPage(targetPage);
}

function goToPage(targetpage){
  pagenow = targetpage;
  printPagination();
  showData();
}

var contactsource = "";
function getEmailSourceList(){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    showMsg("Failed trying get mail source");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=getemailsource',
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
            var sourcecount = resultParse.source.length;
            if(sourcecount == 0){
              var sourceHTML = `
                <div class="submodule_tab_core" id="contactsourcebtnall" onclick='setContactSource("all")' style="backgroud-color:#1B1A17;">
                  All
                </div>
              `;
              document.getElementById("sourceselectiondiv").innerHTML = sourceHTML;
            } else {
              var sourceHTML = `
              <div class="submodule_tab_core" id="contactsourcebtnall" onclick='setContactSource("all")' style="backgroud-color:#1B1A17;">
                All
              </div>
              `;
              var pid = 0;
              while(pid < sourcecount){
                var sourceCache = `
                <div class="submodule_tab_core" id="contactsourcebtn${resultParse.source[pid].code}" onclick='setContactSource("${resultParse.source[pid].code}")' style="backgroud-color:#1B1A17;">
                  ${resultParse.source[pid].name}
                </div>
                `;
                sourceHTML = sourceHTML + sourceCache;
                pid++;
              }
              document.getElementById("sourceselectiondiv").innerHTML = sourceHTML;
            }
            if(contactsource == ""){
              contactsource = "all";
            }
            var contactsourceid = "contactsourcebtn" + contactsource;
            document.getElementById(contactsourceid).style.backgroundColor = "#413F42";
            getEmailList();
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

function setContactSource(code){
  contactsource = code;
  getEmailSourceList();
}

function getEmailList(){
  var portalhash = localStorage.getItem("empportalhash");
  var sortbyval = document.getElementById("sortby").value;
  var searchval = document.getElementById("searchinput").value;
  if(portalhash === ""){
    alert("Security key not found!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=getmaillist',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          sort : sortbyval,
          search : searchval,
          source : contactsource
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            dataorijson = resultParse.maillist;
            datajsonstring = JSON.stringify(dataorijson);
            datajson = datajsonstring;
            printPagination();
            showData();
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

function showData(){
  var resultParse = JSON.parse(datajson);
  var datalength = resultParse.length;
  if(datalength == 0){
    var dataHTML = `<i class="bi bi-emoji-frown-fill"></i> No data`;
  } else {
    var dataHTML = ``;
    var start = (pagenow - 1) * paginationlimit;
    var end = (pagenow * paginationlimit);
    var pid = start;
    while(pid < end && pid < datalength){
      var dataCache = `
      <div class="submodule_datalist_data">
        <div class="submodule_datalist_title">
          ${resultParse[pid].name}
        </div>
        <div class="submodule_datalist_config">
          <button onclick='updateEmail("${resultParse[pid].code}")'><i class="bi bi-pen-fill"></i></button>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            Email
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].email}
          </div>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            Role
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].role}
          </div>
        </div>
      </div>
      `;
      dataHTML = dataHTML + dataCache;
      pid++;
    }
  }
  document.getElementById("datalist").innerHTML = dataHTML;
}

function addNewEmail(){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    showMsg("Unable to find security key!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=getemailsource',
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
            var sourcecount = resultParse.source.length;
            if(sourcecount == 0){
              var newemailsoruceHTML = `- No Source -`;
            } else {
              var newemailsoruceHTML = `
              <tr>
                <th style="width:30px;"></th>
                <th>Source</th>
                <th style="width:100px;">Register</th>
                <th style="width:100px;">Subscribe</th>
              </tr>
              `;
              var pid = 0;
              while(pid < sourcecount){
                var newmailsourcecode = resultParse.source[pid].code;
                var newmailsourcename = resultParse.source[pid].name;
                var newemailsoruceCache = `
                <tr>
                  <td style="font-family:montBold; text-align:center;">
                    ${pid + 1}.
                  </td>
                  <td style="font-family:montBold;">
                    ${newmailsourcename}
                  </td>
                  <td id="addemailsetbtn${newmailsourcecode}" style="text-align:center;">
                    <button onclick='toggleEmailSource("${newmailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
                  </td>
                  <td id="addemailsetbtnsub${newmailsourcecode}" style="text-align:center;">
                    <div class="form_core_contain_itemselect_button" style="color:#7F8487;"><i class="bi bi-toggle-off"></i></div>
                  </td>
                </tr>
                `;
                newemailsoruceHTML = newemailsoruceHTML + newemailsoruceCache;
                pid++;
              }
            }
            var formaddemail = document.getElementById("formaddemail");
            var formaddemailcore = document.getElementById("formaddemailcore");
            formaddemailcore.innerHTML = `
            <div class="form_core_nav">
              <div class="form_core_nav_title">
                <i class="bi bi-plus-circle-dotted"></i> Add New Email
              </div>
              <div class="form_core_nav_button">
                <button onclick='closeNewEmail()'><i class="bi bi-x-lg"></i></button>
              </div>
            </div>
            <div class="form_core_contain">

              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Email
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input type="email" id="addemailemail"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Name
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="addemailname"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Role
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <select id="addemailrole">
                    <option value="">--</option>
                    <option value="Admin">Admin</option>
                    <option value="Internal">Internal</option>
                    <option value="Approval">Approval</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
              </div>
              <table class="form_core_contain_itemselect">
                ${newemailsoruceHTML}
              </table>
              <div class="form_core_contain_submit">
                <button onclick='submitNewEmail()'><i class="bi bi-upload"></i> Submit</button>
              </div>
            </div>
            `;
            formaddemail.style.opacity = "1";
            formaddemail.style.visibility = "visible";
            formaddemailcore.style.transform = "translateY(0px)";
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

const sourceaddval = [];
const sourceaddsubscribeval = [];
function toggleEmailSource(code){
  var index = sourceaddval.indexOf(code);
  if(index == -1) {
    sourceaddval.push(code);
    var targetbutton = "addemailsetbtn" + code;
    document.getElementById(targetbutton).innerHTML = `
    <button onclick='toggleEmailSource("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
    `;
    var targetbuttonsub = "addemailsetbtnsub" + code;
    document.getElementById(targetbuttonsub).innerHTML = `
    <button onclick='toggleEmailSourceSubscribe("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;
  } else {
    sourceaddval.splice(index, 1);
    var targetbutton = "addemailsetbtn" + code;
    document.getElementById(targetbutton).innerHTML = `
    <button onclick='toggleEmailSource("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;

    var indexsub = sourceaddsubscribeval.indexOf(code);
    if(indexsub != -1){
      sourceaddsubscribeval.splice(indexsub, 1);
    }
    var targetbuttonsub = "addemailsetbtnsub" + code;
    document.getElementById(targetbuttonsub).innerHTML = `
    <div class="form_core_contain_itemselect_button" style="color:#7F8487;"><i class="bi bi-toggle-off"></i></div>
    `;
  }
}

function toggleEmailSourceSubscribe(code){
  var indexsub = sourceaddsubscribeval.indexOf(code);
  if(indexsub == -1){
    sourceaddsubscribeval.push(code);
    var targetbuttonsub = "addemailsetbtnsub" + code;
    document.getElementById(targetbuttonsub).innerHTML = `
    <button onclick='toggleEmailSourceSubscribe("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
    `;
  } else {
    sourceaddsubscribeval.splice(indexsub, 1);
    var targetbuttonsub = "addemailsetbtnsub" + code;
    document.getElementById(targetbuttonsub).innerHTML = `
    <button onclick='toggleEmailSourceSubscribe("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;
  }
}

function closeNewEmail(){
  var formaddemail = document.getElementById("formaddemail");
  var formaddemailcore = document.getElementById("formaddemailcore");
  formaddemail.style.opacity = "0";
  formaddemail.style.visibility = "hidden";
  formaddemailcore.style.transform = "translateY(-50px)";
  sourceaddval.splice(0, sourceaddval.length);
}

function submitNewEmail(){
  var portalhash = localStorage.getItem("empportalhash");
  var email = document.getElementById("addemailemail").value;
  var name = document.getElementById("addemailname").value;
  var role = document.getElementById("addemailrole").value;
  var countsource = sourceaddval.length;
  var countsubscribe = sourceaddsubscribeval.length;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(email === ""){
    showMsg("Sorry email cannot be empty!");
  } else if(name === ""){
    showMsg("Sorry name cannot be empty!");
  } else if(role === ""){
    showMsg("Sorry role must be choosen!");
  } else if(countsource == 0){
    showMsg("Sorry source must be choosen!");
  } else {
    var source = JSON.stringify(sourceaddval);
    if(countsubscribe == 0){
      var subscribe = "";
    } else {
      var subscribe = JSON.stringify(sourceaddsubscribeval);
    }
    $.ajax({
      url: apidir + 'newsletter.php?do=addnewemail',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer indraco.WEBDEV'
      },
      data : {
        hash : portalhash,
        email : email,
        name : name,
        role : role,
        source : source,
        subscribe : subscribe
      },
      success: function(result){
        var resultParse = JSON.parse(result);
        var resultStatus = resultParse.status;
        var resultMessage = resultParse.message;
        if(resultStatus === "Success"){
          document.getElementById("messagemsg").innerHTML = resultMessage;
          document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
          document.getElementById("messagebtn").innerHTML = `
          <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
          `;
          var popupmsg = document.getElementById("message");
          var popupmsgcore = document.getElementById("messagecore");
          popupmsg.style.opacity = "1";
          popupmsg.style.visibility = "visible";
          popupmsgcore.style.transform = "translateY(0px)";
          closeNewEmail();
          getEmailList();
        } else {
          showMsg(resultMessage);
        }
      },
      error: function(error){
          console.log(error);
      }
    });
  }
}

const sourceupdateval = [];
const sourcesubupdateval = [];
function toggleUpdateEmailSource(code){
  var index = sourceupdateval.indexOf(code);
  if(index == -1) {
    sourceupdateval.push(code);
    var targetbutton = "updateemailsetbtn" + code;
    document.getElementById(targetbutton).innerHTML = `
    <button onclick='toggleUpdateEmailSource("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
    `;
    var targetsubbutton = "updateemailsetsubbtn" + code;
    document.getElementById(targetsubbutton).innerHTML = `
      <button onclick='toggleUpdateEmailSourceSub("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;
  } else {
    sourceupdateval.splice(index, 1);
    var targetbutton = "updateemailsetbtn" + code;
    document.getElementById(targetbutton).innerHTML = `
    <button onclick='toggleUpdateEmailSource("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;

    var indexsub = sourcesubupdateval.indexOf(code);
    if(indexsub != -1){
      sourcesubupdateval.splice(indexsub, 1);
    }
    var targetsubbutton = "updateemailsetsubbtn" + code;
    document.getElementById(targetsubbutton).innerHTML = `
      <div class="form_core_contain_itemselect_button" style="color:#7F8487;"><i class="bi bi-toggle-off"></i></div>
    `;
  }
}

function toggleUpdateEmailSourceSub(code){
  var indexsub = sourcesubupdateval.indexOf(code);
  if(indexsub == -1){
    sourcesubupdateval.push(code);
    var targetsubbutton = "updateemailsetsubbtn" + code;
    document.getElementById(targetsubbutton).innerHTML = `
      <button onclick='toggleUpdateEmailSourceSub("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
    `;
  } else {
    sourcesubupdateval.splice(indexsub, 1);
    var targetsubbutton = "updateemailsetsubbtn" + code;
    document.getElementById(targetsubbutton).innerHTML = `
      <button onclick='toggleUpdateEmailSourceSub("${code}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
    `;
  }
}

function toggleUpdateEmailSourceIntro(code){
  var index = sourceupdateval.indexOf(code);
  if(index == -1) {
    sourceupdateval.push(code);
  } else {
    sourceupdateval.splice(index, 1);
  }
  var convertjson = JSON.stringify(sourceupdateval);
}

function toggleUpdateEmailSourceSubIntro(code){
  var indexsub = sourcesubupdateval.indexOf(code);
  if(indexsub == -1) {
    sourcesubupdateval.push(code);
  } else {
    sourcesubupdateval.splice(index, 1);
  }
  var convertjson = JSON.stringify(sourcesubupdateval);
}

function updateEmail(code){
  sourceupdateval.length = 0;
  sourcesubupdateval.length = 0;
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    $.ajax({
      url: apidir + 'newsletter.php?do=viewemail',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer indraco.WEBDEV'
      },
      data : {
        hash : portalhash,
        code : code
      },
      success: function(result){
        var resultParse = JSON.parse(result);
        var resultStatus = resultParse.status;
        var resultMessage = resultParse.message;
        if(resultStatus === "Success"){
          document.getElementById("formupdateemailcore").innerHTML = `
          <div class="form_core_nav">
            <div class="form_core_nav_title">
              <i class="bi bi-pen-fill"></i> Update Email Data
            </div>
            <div class="form_core_nav_button">
              <button onclick='closeUpdateEmail()'><i class="bi bi-x-lg"></i></button>
            </div>
          </div>
          <div class="form_core_contain">
            <div class="form_core_viewdel">
              <button onclick='doDeleteEmail()'><i class="bi bi-trash-fill"></i> Delete</button>
            </div>
            <input type="hidden" id="updateemailcode" value=""></input>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Email
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input type="email" id="updateemailemail"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Name
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input id="updateemailname"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Role
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <select id="updateemailrole">
                  <option value="">--</option>
                  <option value="Admin">Admin</option>
                  <option value="Internal">Internal</option>
                  <option value="Approval">Approval</option>
                  <option value="Staff">Staff</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
            </div>
            <table class="form_core_contain_itemselect" id="updateemailsourcediv">

            </table>
            <div class="form_core_contain_submit">
              <button onclick='submitUpdateEmail()'><i class="bi bi-upload"></i> Submit</button>
            </div>
          </div>
          `;
          document.getElementById("updateemailcode").value = resultParse.email.code;
          document.getElementById("updateemailemail").value = resultParse.email.email;
          document.getElementById("updateemailname").value = resultParse.email.name;
          var rolevalue = resultParse.email.role;
          if(rolevalue === "Admin"){
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin" selected>Admin</option>
            <option value="Internal">Internal</option>
            <option value="Approval">Approval</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
            `;
          } else if(rolevalue === "Internal"){
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin">Admin</option>
            <option value="Internal" selected>Internal</option>
            <option value="Approval">Approval</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
            `;
          } else if(rolevalue === "Approval"){
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin">Admin</option>
            <option value="Internal">Internal</option>
            <option value="Approval" selected>Approval</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
            `;
          } else if(rolevalue === "Staff"){
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin">Admin</option>
            <option value="Internal">Internal</option>
            <option value="Approval">Approval</option>
            <option value="Staff" selected>Staff</option>
            <option value="Customer">Customer</option>
            `;
          } else if(rolevalue === "Customer"){
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin">Admin</option>
            <option value="Internal">Internal</option>
            <option value="Approval">Approval</option>
            <option value="Staff">Staff</option>
            <option value="Customer" selected>Customer</option>
            `;
          } else {
            var roleHTML = `
            <option value="">--</option>
            <option value="Admin">Admin</option>
            <option value="Internal">Internal</option>
            <option value="Approval">Approval</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
            `;
          }
          document.getElementById("updateemailrole").innerHTML = roleHTML;

          var sourcecount = resultParse.email.source.length;
          if(sourcecount == 0){
            var sourceHTML = `<tr><td>- no source data -</td></tr>`;
          } else {
            var sourceHTML = `
            <tr>
              <th style="width:30px;"></th>
              <th>Source</th>
              <th style="width:100px;">Register</th>
              <th style="width:100px;">Subscribe</th>
            </tr>
            `;
            var pidsource = 0;
            while(pidsource < sourcecount){
              var updatemailsourcecode = resultParse.email.source[pidsource].code;
              var updatemailsourcename = resultParse.email.source[pidsource].name;
              var updatemailsourcestatus = resultParse.email.source[pidsource].status;
              var updatemailsourcesubstatus = resultParse.email.source[pidsource].subscribe;
              if(updatemailsourcestatus === "Active"){
                toggleUpdateEmailSourceIntro(updatemailsourcecode);
              }
              if(updatemailsourcesubstatus === "Subscribe"){
                toggleUpdateEmailSourceSubIntro(updatemailsourcecode);
              }
              if(updatemailsourcestatus === "Active" && updatemailsourcesubstatus === "Subscribe"){
                var updateemailsoruceCache = `
                <tr>
                  <td style="font-family:montBold; text-align:center;">
                    ${pidsource + 1}.
                  </td>
                  <td style="font-family:montBold;">
                    ${updatemailsourcename}
                  </td>
                  <td id="updateemailsetbtn${updatemailsourcecode}" style="text-align:center;">
                    <button onclick='toggleUpdateEmailSource("${updatemailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
                  </td>
                  <td id="updateemailsetsubbtn${updatemailsourcecode}" style="text-align:center;">
                    <button onclick='toggleUpdateEmailSourceSub("${updatemailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
                  </td>
                </tr>
                `;
              } else if(updatemailsourcestatus === "Active" && updatemailsourcesubstatus === "Unsubscribe"){
                var updateemailsoruceCache = `
                <tr>
                  <td style="font-family:montBold; text-align:center;">
                    ${pidsource + 1}.
                  </td>
                  <td style="font-family:montBold;">
                    ${updatemailsourcename}
                  </td>
                  <td id="updateemailsetbtn${updatemailsourcecode}" style="text-align:center;">
                    <button onclick='toggleUpdateEmailSource("${updatemailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-on"></i></button>
                  </td>
                  <td id="updateemailsetsubbtn${updatemailsourcecode}" style="text-align:center;">
                    <button onclick='toggleUpdateEmailSourceSub("${updatemailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
                  </td>
                </tr>
                `;
              } else {
                var updateemailsoruceCache = `
                <tr>
                  <td style="font-family:montBold; text-align:center;">
                    ${pidsource + 1}.
                  </td>
                  <td style="font-family:montBold;">
                    ${updatemailsourcename}
                  </td>
                  <td id="updateemailsetbtn${updatemailsourcecode}" style="text-align:center;">
                    <button onclick='toggleUpdateEmailSource("${updatemailsourcecode}")' class="form_core_contain_itemselect_button"><i class="bi bi-toggle-off"></i></button>
                  </td>
                  <td id="updateemailsetsubbtn${updatemailsourcecode}" style="text-align:center;">
                    <div class="form_core_contain_itemselect_button" style="color:#7F8487;"><i class="bi bi-toggle-off"></i></div>
                  </td>
                </tr>
                `;
              }
              sourceHTML = sourceHTML + updateemailsoruceCache;
              pidsource++;
            }
          }
          document.getElementById("updateemailsourcediv").innerHTML = sourceHTML;
          var formupdateemail = document.getElementById("formupdateemail");
          var formupdateemailcore = document.getElementById("formupdateemailcore");
          formupdateemail.style.opacity = "1";
          formupdateemail.style.visibility = "visible";
          formupdateemailcore.style.transform = "translateY(0px)";
        } else {
          showMsg(resultMessage);
        }
      },
      error: function(error){
          console.log(error);
      }
    });
  }
}

function closeUpdateEmail(){
  var formupdateemail = document.getElementById("formupdateemail");
  var formupdateemailcore = document.getElementById("formupdateemailcore");
  formupdateemail.style.opacity = "0";
  formupdateemail.style.visibility = "hidden";
  formupdateemailcore.style.transform = "translateY(-50px)";
  sourceupdateval.splice(0, sourceupdateval.length);
}

function submitUpdateEmail(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updateemailcode").value;
  var email = document.getElementById("updateemailemail").value;
  var name = document.getElementById("updateemailname").value;
  var role = document.getElementById("updateemailrole").value;
  var sourcecount = sourceupdateval.length;
  var subscribecount = sourcesubupdateval.length;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else if(email === ""){
    showMsg("Sorry email cannot be empty!");
  } else if(name === ""){
    showMsg("Sorry name cannot be empty!");
  } else if(role === ""){
    showMsg("Sorry role must be choosen!");
  } else {
    var source = JSON.stringify(sourceupdateval);
    if(subscribecount == 0){
      var subscribe = "";
    } else {
      var subscribe = JSON.stringify(sourcesubupdateval);
    }
    $.ajax({
      url: apidir + 'newsletter.php?do=updateemail',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer indraco.WEBDEV'
      },
      data : {
        hash : portalhash,
        code : code,
        email : email,
        name : name,
        role : role,
        source : source,
        subscribe : subscribe
      },
      success: function(result){
        var resultParse = JSON.parse(result);
        var resultStatus = resultParse.status;
        var resultMessage = resultParse.message;
        if(resultStatus === "Success"){
          document.getElementById("messagemsg").innerHTML = resultMessage;
          document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
          document.getElementById("messagebtn").innerHTML = `
          <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
          `;
          var popupmsg = document.getElementById("message");
          var popupmsgcore = document.getElementById("messagecore");
          popupmsg.style.opacity = "1";
          popupmsg.style.visibility = "visible";
          popupmsgcore.style.transform = "translateY(0px)";
          closeUpdateEmail();
          getEmailList();
        } else {
          showMsg(resultMessage);
        }
      },
      error: function(error){
          console.log(error);
      }
    });
  }
}

function getContentList(){
  var portalhash = localStorage.getItem("empportalhash");
  var sort = document.getElementById("contentsortby").value;
  var search = document.getElementById("contentsearchinput").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else {
    $.ajax({
      url: apidir + 'newsletter.php?do=listcontent',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer indraco.WEBDEV'
      },
      data : {
        hash : portalhash,
        sort : sort,
        search : search
      },
      success: function(result){
        var resultParse = JSON.parse(result);
        var resultStatus = resultParse.status;
        var resultMessage = resultParse.message;
        if(resultStatus === "Success"){
          dataorijson = resultParse.content;
          datajsonstring = JSON.stringify(dataorijson);
          datajson = datajsonstring;
          printPaginationContent();
          showDataContent();
        } else {
          showMsg(resultMessage);
        }
      },
      error: function(error){
          console.log(error);
      }
    });
  }
}

function printPaginationContent(){
  var resultParse = JSON.parse(datajson);
  var dataHTML = ``;
  var dataLength = resultParse.length;
  if(dataLength >= 1){
    if(dataLength == 1){
      document.getElementById("totalcontentdata").innerHTML = `Result Data : 1`;
    } else {
      document.getElementById("totalcontentdata").innerHTML = `Result Datas : ${dataLength}`;
    }
    var pagetotalraw = dataLength / paginationlimit;
    var pagetotals = Math.ceil(pagetotalraw);
    pagetotal = pagetotals;
    if(pagenow == 1){
      var paginationHTML = `
      <button style="color:lightgrey;" id="paginationbtncontentfirst"><i class="bi bi-chevron-double-left"></i></button>
      <button style="color:lightgrey;" id="paginationbtncontentprev"><i class="bi bi-chevron-left"></i></button>
      `;
    } else {
      var paginationHTML = `
      <button onclick='goToFirstContent()' style="color:#1B1A17;" id="paginationbtncontentfirst"><i class="bi bi-chevron-double-left"></i></button>
      <button onclick='goToPrevContent()' style="color:#1B1A17;" id="paginationbtncontentprev"><i class="bi bi-chevron-left"></i></button>
      `;
    }
    var paginationpid = 1;
    while(paginationpid <= pagetotals){
      if(paginationpid == 1){
        var paginationpagebtnCache = `
          <button onclick='goToPageContent("${paginationpid}")' style="color:#1B1A17;" id="paginationcontentpage${paginationpid}">${paginationpid}</button>
        `;
      } else {
        var paginationpagebtnCache = `
          <button onclick='goToPageContent("${paginationpid}")' style="color:#1B1A17;" id="paginationcontentpage${paginationpid}">${paginationpid}</button>
        `;
      }
      paginationHTML = paginationHTML + paginationpagebtnCache;
      paginationpid++;
    }
    if(pagetotal == 1 || pagenow == pagetotal){
      paginationHTML = paginationHTML + `
      <button style="color:lightgrey;" id="paginationbtncontentnext"><i class="bi bi-chevron-right"></i></button>
      <button style="color:lightgrey;" id="paginationbtncontentlast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    } else {
      paginationHTML = paginationHTML + `
      <button onclick='goToNextContent()' style="color:#1B1A17;" id="paginationbtncontentnext"><i class="bi bi-chevron-right"></i></button>
      <button onclick='goToLastContent()' style="color:#1B1A17;" id="paginationbtncontentlast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    }
    document.getElementById("contentpaginationlist").innerHTML = paginationHTML;
    var activatepagenow = "paginationcontentpage" + pagenow;
    document.getElementById(activatepagenow).style.backgroundColor = "rgba(0,0,0,.1)";
  } else {
    document.getElementById("contentpaginationlist").innerHTML = "";
    document.getElementById("totalcontentdata").innerHTML = `Result Data : 0`;
    var datalist = document.getElementById("datalist");
    datalist.innerHTML = `<i class="bi bi-emoji-frown-fill"></i> Empty Result`;
  }
}

function goToFirstContent(){
  var targetPage = 1;
  goToPageContent(targetPage);
}

function goToPrevContent(){
  var targetPage = pagenow - 1;
  goToPageContent(targetPage);
}

function goToNextContent(){
  var targetPage = pagenow + 1;
  goToPageContent(targetPage);
}

function goToLastContent(){
  var targetPage = pagetotal;
  goToPageContent(targetPage);
}

function goToPageContent(targetpage){
  pagenow = targetpage;
  printPaginationContent();
  showDataContent();
}

function showDataContent(){
  var resultParse = JSON.parse(datajson);
  var datalength = resultParse.length;
  if(datalength == 0){
    var dataHTML = `<i class="bi bi-emoji-frown-fill"></i> No data`;
  } else {
    var dataHTML = ``;
    var start = (pagenow - 1) * paginationlimit;
    var end = (pagenow * paginationlimit);
    var pid = start;
    while(pid < end && pid < datalength){
      var dataCache = `
      <div class="submodule_datalist_data">
        <div class="submodule_datalist_title">
          ${resultParse[pid].title}
        </div>
        <div class="submodule_datalist_config">
          <button onclick='updateContent("${resultParse[pid].code}")'><i class="bi bi-pen-fill"></i></button>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            Release Target
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].targettime}
          </div>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            Web
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].web}
          </div>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            Status
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].status}
          </div>
        </div>
      </div>
      `;
      dataHTML = dataHTML + dataCache;
      pid++;
    }
  }
  document.getElementById("datacontentlist").innerHTML = dataHTML;
}

if(typeof addnewcontentval === 'undefined'){
  let addnewcontentval;
}
function runEditor1(){
  ClassicEditor
    .create(document.querySelector('#addcontentcontent'),{
      removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
    })
    .then( newEditor => {
      addnewcontentval = newEditor;
    })
    .catch( error => {
      console.error( error );
    });
}

function addNewContent(){
  document.getElementById("formaddcontentcore").innerHTML = `
  <div class="form_core_nav">
    <div class="form_core_nav_title">
      <i class="bi bi-plus-circle-dotted"></i> Add New Content
    </div>
    <div class="form_core_nav_button">
      <button onclick='closeNewContent()'><i class="bi bi-x-lg"></i></button>
    </div>
  </div>
  <div class="form_core_contain">
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Title
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <input id="addcontenttitle"></input>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Subject
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <input id="addcontentsubject"></input>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Type
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <select id="addcontenttype" onchange='addcontentChange()'>
          <option value="Text" selected>Text</option>
          <option value="HTML">HTML</option>
        </select>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Content
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core" id="addcontentcontentdiv">
        <textarea id="addcontentcontent" style="min-height:500px; background-color:rgba(255,255,255,.3);"></textarea>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Attachment
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <input type="file" id="addcontentattachment"></input>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Target Time
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <input type="datetime-local" id="addcontenttargettime"></input>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Web target
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <input id="addcontentweb"></input>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Note
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <textarea id="addcontentnote"></textarea>
      </div>
    </div>
    <div class="form_core_contain_item">
      <div class="form_core_contain_title">
        Status
      </div>
      <div class="form_core_contain_sep">
        :
      </div>
      <div class="form_core_contain_core">
        <select id="addcontentstatus">
          <option value="">--</option>
          <option value="Draft">Draft</option>
          <option value="Ready">Ready</option>
          <option value="Launched">Launched</option>
        </select>
      </div>
    </div>
    <div class="form_core_contain_submit">
      <button onclick='submitNewContent()'><i class="bi bi-upload"></i> Submit</button>
    </div>
  </div>
  `;
  runEditor1();
  var formaddcontent = document.getElementById("formaddcontent");
  var formaddcontentcore = document.getElementById("formaddcontentcore");
  formaddcontent.style.opacity = "1";
  formaddcontent.style.visibility = "visible";
  formaddcontentcore.style.transform = "translateY(0px)";
}

function closeNewContent(){
  var formaddcontent = document.getElementById("formaddcontent");
  var formaddcontentcore = document.getElementById("formaddcontentcore");
  formaddcontent.style.opacity = "0";
  formaddcontent.style.visibility = "hidden";
  formaddcontentcore.style.transform = "translateY(-50px)";
}

function addcontentChange(){
  var addcontenttype = document.getElementById("addcontenttype").value;
  if(addcontenttype == "Text"){
    runEditor1();
  } else if(addcontenttype == "HTML"){
    var articleset = addnewcontentval.getData();
    var addcontentcontentdiv = document.getElementById("addcontentcontentdiv");
    addcontentcontentdiv.innerHTML = `
    <textarea id="addcontentcontent" style="min-height:500px; background-color:rgba(255,255,255,.3);">${articleset}</textarea>
    `;
  } else {

  }
}

function submitNewContent(){
  var portalhash = localStorage.getItem("empportalhash");
  var title = document.getElementById("addcontenttitle").value;
  var subject = document.getElementById("addcontentsubject").value;
  var type = document.getElementById("addcontenttype").value;
  var content = addnewcontentval.getData();
  var attachment = document.getElementById('addcontentattachment').files[0];
  var targettime = document.getElementById("addcontenttargettime").value;
  var web = document.getElementById("addcontentweb").value;
  var note = document.getElementById("addcontentnote").value;
  var status = document.getElementById("addcontentstatus").value;
  if(title == ""){
    showMsg("Sorry title cannot be empty!");
  } else if(subject == ""){
    showMsg("Sorry subject cannot be empty!");
  } else if(type == ""){
    showMsg("Sorry type must be choosen!");
  } else if(content == ""){
    showMsg("Sorry content cannot be empty!");
  } else if(targettime == ""){
    showMsg("Sorry target time cannot be empty!");
  } else if(web == ""){
    showMsg("Sorry web target cannot be empty!");
  } else if(status == ""){
    showMsg("Sorry status must be choosen!");
  } else {
    var formData = new FormData();
    formData.append('hash', portalhash);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('type', type);
    formData.append('content', content);
    formData.append('attachment', $("#addcontentattachment")[0].files[0]);
    formData.append('targettime', targettime);
    formData.append('web', web);
    formData.append('note', note);
    formData.append('status', status);
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=submitcontent',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : formData,
        processData: false,
        contentType: false,
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getContentList();
            closeNewContent();
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

if(typeof updatecontentval === 'undefined'){
  let updatecontentval;
}
function runEditor2(){
  ClassicEditor
    .create(document.querySelector('#updatecontentcontent'),{
      removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
    })
    .then( newEditor => {
      updatecontentval = newEditor;
    })
    .catch( error => {
      console.error( error );
    });
}

function updatecontentChange(){
  var addcontenttype = document.getElementById("updatecontenttype").value;
  if(addcontenttype == "Text"){
    runEditor2();
  } else if(addcontenttype == "HTML"){
    var articleset = updatecontentval.getData();
    var updatecontentcontentdiv = document.getElementById("updatecontentcontentdiv");
    updatecontentcontentdiv.innerHTML = `
    <textarea id="updatecontentcontent" style="min-height:500px; background-color:rgba(255,255,255,.3);">${articleset}</textarea>
    `;
  } else {

  }
}

function updateContent(code){
  var portalhash = localStorage.getItem("empportalhash");
  if(code === ""){
    showMsg("Sorry code is empty!");
  } else if(portalhash === ""){
    showMsg("Sorry security key is empty!");
  } else {
    $.ajax({
      url: apidir + 'newsletter.php?do=contentdetail',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer indraco.WEBDEV'
      },
      data : {
        hash : portalhash,
        code : code
      },
      success: function(result){
        var resultParse = JSON.parse(result);
        var resultStatus = resultParse.status;
        var resultMessage = resultParse.message;
        if(resultStatus === "Success"){
          var targettimedbvalori = resultParse.content.targettime;
          var targettimedbval = targettimedbvalori.replace(" ", "T");
          var updateHTML = `
          <div class="form_core_nav">
            <div class="form_core_nav_title">
              <i class="bi bi-pen-fill"></i> Update Content
            </div>
            <div class="form_core_nav_button">
              <button onclick='closeUpdateContent()'><i class="bi bi-x-lg"></i></button>
            </div>
          </div>
          <div class="form_core_contain">
            <div class="form_core_viewdel">
              <button onclick='doDeleteContent()'><i class="bi bi-trash-fill"></i> Delete</button>
            </div>
            <input type="hidden" value="${resultParse.content.code}" id="updatecontentcode"></input>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Title
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input id="updatecontenttitle" value="${resultParse.content.title}"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Subject
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input id="updatecontentsubject" value="${resultParse.content.subject}"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Type
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <select id="updatecontenttype" onchange='updatecontentChange()'>
                  <option value="Text" selected>Text</option>
                  <option value="HTML">HTML</option>
                </select>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Content
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core" id="updatecontentcontentdiv">
                <textarea id="updatecontentcontent" style="min-height:500px; background-color:rgba(255,255,255,.3);">${resultParse.content.content}</textarea>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Attachment
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core" id="updatecontentattachavail">

              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Replace Attachment
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input type="file" id="updatecontentattachment"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Target Time
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input type="datetime-local" id="updatecontenttargettime" value="${targettimedbval}"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Web target
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <input id="updatecontentweb" value="${resultParse.content.webtarget}"></input>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Note
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <textarea id="updatecontentnote">${resultParse.content.note}</textarea>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                Status
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                <select id="updatecontentstatus">
                  <option value="">--</option>
                  <option value="Draft">Draft</option>
                  <option value="Ready">Ready</option>
                  <option value="Launched">Launched</option>
                </select>
              </div>
            </div>
            <div class="form_core_contain_item">
              <div class="form_core_contain_title">
                URL
              </div>
              <div class="form_core_contain_sep">
                :
              </div>
              <div class="form_core_contain_core">
                ${resultParse.content.url}
              </div>
            </div>
            <div class="form_core_contain_submit">
              <button onclick='submitUpdateContent()'><i class="bi bi-upload"></i> Submit</button>
            </div>

          </div>
          `;
          document.getElementById("formupdatecontentcore").innerHTML = updateHTML;

          var attachdbavail = resultParse.content.attachment;
          if(attachdbavail == ""){
            var attachavailHTML = `
            No Attachment
            `;
          } else {
            var attachavailHTML = `
            <button onclick="window.open('${webdir + attachdbavail}', '_blank')"><i class="bi bi-file-arrow-down-fill"></i> Download</button>
            `;
          }
          var updatecontentattachavail = document.getElementById("updatecontentattachavail").innerHTML = attachavailHTML;

          var typedbval = resultParse.content.type;
          if(typedbval == "Text"){
            document.getElementById("updatecontenttype").innerHTML = `
            <option value="Text" selected>Text</option>
            <option value="HTML">HTML</option>
            `;
            runEditor2();
          } else if(typedbval == "HTML"){
            document.getElementById("updatecontenttype").innerHTML = `
            <option value="Text">Text</option>
            <option value="HTML" selected>HTML</option>
            `;
          } else {

          }

          var statusdbval = resultParse.content.status;
          if(statusdbval == "Draft"){
            var statusHTML = `
            <option value="">--</option>
            <option value="Draft" selected>Draft</option>
            <option value="Ready">Ready</option>
            <option value="Launched">Launched</option>
            `;
          } else if(statusdbval == "Ready"){
            var statusHTML = `
            <option value="">--</option>
            <option value="Draft">Draft</option>
            <option value="Ready" selected>Ready</option>
            <option value="Launched">Launched</option>
            `;
          } else if(statusdbval == "Launched"){
            var statusHTML = `
            <option value="">--</option>
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Launched" selected>Launched</option>
            `;
          } else {
            var statusHTML = `
            <option value="">--</option>
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Launched">Launched</option>
            `;
          }
          document.getElementById("updatecontentstatus").innerHTML = statusHTML;
          var formupdatecontent = document.getElementById("formupdatecontent");
          var formupdatecontentcore = document.getElementById("formupdatecontentcore");
          formupdatecontent.style.opacity = "1";
          formupdatecontent.style.visibility = "visible";
          formupdatecontentcore.style.transform = "translateY(0px)";
        } else {
          showMsg(resultMessage);
        }
      },
      error: function(error){
          console.log(error);
      }
    });
  }
}

function closeUpdateContent(){
  var formupdatecontent = document.getElementById("formupdatecontent");
  var formupdatecontentcore = document.getElementById("formupdatecontentcore");
  formupdatecontent.style.opacity = "0";
  formupdatecontent.style.visibility = "hidden";
  formupdatecontentcore.style.transform = "translateY(-50px)";
}

function submitUpdateContent(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updatecontentcode").value;
  var title = document.getElementById("updatecontenttitle").value;
  var subject = document.getElementById("updatecontentsubject").value;
  var type = document.getElementById("updatecontenttype").value;
  var content = updatecontentval.getData();
  var targettime = document.getElementById("updatecontenttargettime").value;
  var web = document.getElementById("updatecontentweb").value;
  var note = document.getElementById("updatecontentnote").value;
  var status = document.getElementById("updatecontentstatus").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else if(title == ""){
    showMsg("Sorry title cannot be empty!");
  } else if(subject == ""){
    showMsg("Sorry subject cannot be empty!");
  } else if(type == ""){
    showMsg("Sorry type must be choosen!");
  } else if(content == ""){
    showMsg("Sorry content cannot be empty!");
  } else if(targettime == ""){
    showMsg("Sorry target cannot be empty!");
  } else if(web == ""){
    showMsg("Sorry web cannot be empty!");
  } else if(status == ""){
    showMsg("Sorry status must be choosen!");
  } else {
    var formData = new FormData();
    formData.append('hash', portalhash);
    formData.append('code', code);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('type', type);
    formData.append('content', content);
    formData.append('attachment',  $("#updatecontentattachment")[0].files[0]);
    formData.append('targettime', targettime);
    formData.append('web', web);
    formData.append('note', note);
    formData.append('status', status);
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=contentupdate',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : formData,
        processData: false,
        contentType: false,
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getContentList();
            closeUpdateContent();
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

function getMediaList(){
  var portalhash = localStorage.getItem("empportalhash");
  var sortby = document.getElementById("mediasortby").value;
  var search = document.getElementById("mediasearchinput").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=medialist',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          sort : sortby,
          search : search
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            dataorijson = resultParse.media;
            datajsonstring = JSON.stringify(dataorijson);
            datajson = datajsonstring;
            printPaginationMedia();
            showMediaData();
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

function showMediaData(){
  var resultParse = JSON.parse(datajson);
  var datalength = resultParse.length;
  if(datalength == 0){
    var dataHTML = `<i class="bi bi-emoji-frown-fill"></i> No data`;
  } else {
    var mediaHTML = ``;
    var start = (pagenow - 1) * paginationlimit;
    var end = (pagenow * paginationlimit);
    var pid = start;
    while(pid < end && pid < datalength){
      var mediastatus = resultParse[pid].status;
      if(mediastatus == "Active"){
        var mediaCache = `
        <div onclick='showMedia("${resultParse[pid].code}")' class="submodule_datalist_media" style="background-image:url('${webdir + resultParse[pid].url}')">
          <div class="submodule_datalist_media_title">
            ${resultParse[pid].title}
          </div>
        </div>
        `;
      } else {
        var mediaCache = `
        <div onclick='showMedia("${resultParse[pid].code}")' class="submodule_datalist_media" style="opacity:0.5; background-image:url('${webdir + resultParse[pid].url}')">
          <div class="submodule_datalist_media_title">
            ${resultParse[pid].title}
          </div>
        </div>
        `;
      }
      mediaHTML = mediaHTML + mediaCache;
      pid++;
    }
  }
  document.getElementById("datamedialist").innerHTML = mediaHTML;
}

function printPaginationMedia(){
  var resultParse = JSON.parse(datajson);
  var paginationHTML = ``;
  var dataLength = resultParse.length;
  if(dataLength >= 1){
    if(dataLength == 1){
      document.getElementById("totalmediadata").innerHTML = `Result Data : 1`;
    } else {
      document.getElementById("totalmediadata").innerHTML = `Result Datas : ${dataLength}`;
    }
    var pagetotalraw = dataLength / paginationlimit;
    var pagetotals = Math.ceil(pagetotalraw);
    pagetotal = pagetotals;
    if(pagenow == 1){
      var paginationHTML = `
      <button style="color:lightgrey;" id="paginationbtnmediafirst"><i class="bi bi-chevron-double-left"></i></button>
      <button style="color:lightgrey;" id="paginationbtnmediaprev"><i class="bi bi-chevron-left"></i></button>
      `;
    } else {
      var paginationHTML = `
      <button onclick='goToFirstMedia()' style="color:#1B1A17;" id="paginationbtnmediafirst"><i class="bi bi-chevron-double-left"></i></button>
      <button onclick='goToPrevMedia()' style="color:#1B1A17;" id="paginationbtnmediaprev"><i class="bi bi-chevron-left"></i></button>
      `;
    }
    var paginationpid = 1;
    while(paginationpid <= pagetotals){
      if(paginationpid == 1){
        var paginationpagebtnCache = `
          <button onclick='goToPageMedia("${paginationpid}")' style="color:#1B1A17;" id="paginationmediapage${paginationpid}">${paginationpid}</button>
        `;
      } else {
        var paginationpagebtnCache = `
          <button onclick='goToPageMedia("${paginationpid}")' style="color:#1B1A17;" id="paginationmediapage${paginationpid}">${paginationpid}</button>
        `;
      }
      paginationHTML = paginationHTML + paginationpagebtnCache;
      paginationpid++;
    }
    if(pagetotal == 1 || pagenow == pagetotal){
      paginationHTML = paginationHTML + `
      <button style="color:lightgrey;" id="paginationbtnmedianext"><i class="bi bi-chevron-right"></i></button>
      <button style="color:lightgrey;" id="paginationbtnmedialast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    } else {
      paginationHTML = paginationHTML + `
      <button onclick='goToNextMedia()' style="color:#1B1A17;" id="paginationbtnmedianext"><i class="bi bi-chevron-right"></i></button>
      <button onclick='goToLastMedia()' style="color:#1B1A17;" id="paginationbtnmedialast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    }
    document.getElementById("mediapaginationlist").innerHTML = paginationHTML;
    var activatepagenow = "paginationmediapage" + pagenow;
    document.getElementById(activatepagenow).style.backgroundColor = "rgba(0,0,0,.1)";
  } else {
    document.getElementById("contentpaginationlist").innerHTML = "";
    document.getElementById("totalmediadata").innerHTML = `Result Data : 0`;
    var datalist = document.getElementById("datalist");
    datalist.innerHTML = `<i class="bi bi-emoji-frown-fill"></i> Empty Result`;
  }
}

function goToFirstMedia(){
  var targetPage = 1;
  goToPageMedia(targetPage);
}

function goToPrevMedia(){
  var targetPage = pagenow - 1;
  goToPageMedia(targetPage);
}

function goToNextMedia(){
  var targetPage = pagenow + 1;
  goToPageMedia(targetPage);
}

function goToLastMedia(){
  var targetPage = pagetotal;
  goToPageMedia(targetPage);
}

function goToPageMedia(targetpage){
  pagenow = targetpage;
  printPaginationMedia();
  showMediaData();
}

function addNewMedia(){
  var formaddmedia = document.getElementById("formaddmedia");
  var formaddmediacore = document.getElementById("formaddmediacore");
  formaddmedia.style.opacity = "1";
  formaddmedia.style.visibility = "visible";
  formaddmediacore.style.transform = "translateY(0px)";
}

function closeNewMedia(){
  var formaddmedia = document.getElementById("formaddmedia");
  var formaddmediacore = document.getElementById("formaddmediacore");
  formaddmedia.style.opacity = "0";
  formaddmedia.style.visibility = "hidden";
  formaddmediacore.style.transform = "translateY(-50px)";
  setTimeout(function(){
    document.getElementById("formaddmediacore").innerHTML = `
    <div class="form_core_nav">
      <div class="form_core_nav_title">
        <i class="bi bi-plus-circle-dotted"></i> Add New Media
      </div>
      <div class="form_core_nav_button">
        <button onclick='closeNewMedia()'><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="form_core_contain">
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Title
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addmediatitle"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Media
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input type="file" id="addmediafile"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Description
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <textarea id="addmediadesc"></textarea>
        </div>
      </div>
      <div class="form_core_contain_submit">
        <button onclick='submitNewMedia()'><i class="bi bi-upload"></i> Upload</button>
      </div>
    </div>
    `;
  }, 500);
}

function submitNewMedia(){
  var portalhash = localStorage.getItem("empportalhash");
  var title = document.getElementById("addmediatitle").value;
  var desc = document.getElementById("addmediadesc").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(title == ""){
    showMsg("Sorry title cannot be empty!");
  } else {
    var formData = new FormData();
    formData.append('hash', portalhash);
    formData.append('title', title);
    formData.append('media',  $("#addmediafile")[0].files[0]);
    formData.append('desc', desc);
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=mediaadd',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : formData,
        processData: false,
        contentType: false,
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getMediaList();
            closeNewMedia();
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


function showMedia(code){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=mediaview',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("formviewmediacore").innerHTML = `
            <div class="form_core_nav">
              <div class="form_core_nav_title">
                <i class="bi bi-card-image"></i> Media Detail
              </div>
              <div class="form_core_nav_button">
                <button onclick='closeViewMedia()'><i class="bi bi-x-lg"></i></button>
              </div>
            </div>
            <div class="form_core_contain">

              <div class="form_core_viewdel">
                <button onclick='doDeleteMedia()'><i class="bi bi-trash-fill"></i> Delete</button>
              </div>

              <div class="form_core_viewimg_container">
                <img class="form_core_viewimg" src='${webdir + resultParse.media.url}'>
                </img>
              </div>
              <div class="form_core_viewimg_desc">
                <input type="text" value="${webdir + resultParse.media.url}" id="externallink"></input>
                <button onclick='copyExternalLink()'><i class="bi bi-files"></i> Copy External Link</button>
              </div>

              <input type="hidden" id="viewmediacode" value="${resultParse.media.code}"></input>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Title
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="viewmediatitle" value="${resultParse.media.title}"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Replace Media
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input type="file" id="viewmediafile"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Description
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <textarea id="viewmediadesc">${resultParse.media.desc}</textarea>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Status
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <select id="viewmediastatus">
                    <option value=""> -- </option>
                    <option value="Active">Active</option>
                    <option value="Unused">Unused</option>
                  </select>
                </div>
              </div>
              <div class="form_core_contain_submit">
                <button onclick='submitUpdateMedia()'><i class="bi bi-upload"></i> Update</button>
              </div>
            </div>
            `;
            var mediastatusdb = resultParse.media.status;
            if(mediastatusdb == "Active"){
              var mediastatusCache = `
              <option value=""> -- </option>
              <option value="Active" selected>Active</option>
              <option value="Unused">Unused</option>
              `;
            } else if(mediastatusdb == "Unused"){
              var mediastatusCache = `
              <option value=""> -- </option>
              <option value="Active">Active</option>
              <option value="Unused" selected>Unused</option>
              `;
            } else {
              var mediastatusCache = `
              <option value=""> -- </option>
              <option value="Active">Active</option>
              <option value="Unused">Unused</option>
              `;
            }
            document.getElementById("viewmediastatus").innerHTML = mediastatusCache;
            var formviewmedia = document.getElementById("formviewmedia");
            var formviewmediacore = document.getElementById("formviewmediacore");
            formviewmedia.style.opacity = "1";
            formviewmedia.style.visibility = "visible";
            formviewmediacore.style.transform = "translateY(0px)";
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


function closeViewMedia(){
  var formviewmedia = document.getElementById("formviewmedia");
  var formviewmediacore = document.getElementById("formviewmediacore");
  formviewmedia.style.opacity = "0";
  formviewmedia.style.visibility = "hidden";
  formviewmediacore.style.transform = "translateY(-50px)";
}

function submitUpdateMedia(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("viewmediacode").value;
  var title = document.getElementById("viewmediatitle").value;
  var desc = document.getElementById("viewmediadesc").value;
  var status = document.getElementById("viewmediastatus").value;
  if(portalhash == ""){
    showMsg("Sorry security key not found!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else if(title == ""){
    showMsg("Sorry title cannot be empty!");
  } else if(desc == ""){
    showMsg("Sorry desc cannot be empty!");
  } else if(status == ""){
    showMsg("Sorry status must be choosen!");
  } else {
    var formData = new FormData();
    formData.append('hash', portalhash);
    formData.append('code', code);
    formData.append('title', title);
    formData.append('media',  $("#viewmediafile")[0].files[0]);
    formData.append('desc', desc);
    formData.append('status', status);
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=mediaupdate',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : formData,
        processData: false,
        contentType: false,
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getMediaList();
            closeViewMedia();
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


function doDeleteEmail(){
  var formdeletemedia = document.getElementById("formdeleteemail");
  var formdeletemediacore = document.getElementById("formdeleteemailcore");
  formdeletemedia.style.opacity = "1";
  formdeletemedia.style.visibility = "visible";
  formdeletemediacore.style.transform = "translateY(0px)";
}

function closeDeleteEmail(){
  var formdeletemedia = document.getElementById("formdeleteemail");
  var formdeletemediacore = document.getElementById("formdeleteemailcore");
  formdeletemedia.style.opacity = "0";
  formdeletemedia.style.visibility = "hidden";
  formdeletemediacore.style.transform = "translateY(-50px)";
}

function deleteEmail(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updateemailcode").value;
  if(portalhash == ""){
    showMsg("Sorry Security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry Code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=emaildelete',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeDeleteEmail();
            getEmailList();
            closeUpdateEmail();
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

function doDeleteContent(){
  var formdeletemedia = document.getElementById("formdeletecontent");
  var formdeletemediacore = document.getElementById("formdeletecontentcore");
  formdeletemedia.style.opacity = "1";
  formdeletemedia.style.visibility = "visible";
  formdeletemediacore.style.transform = "translateY(0px)";
}

function closeDeleteContent(){
  var formdeletemedia = document.getElementById("formdeletecontent");
  var formdeletemediacore = document.getElementById("formdeletecontentcore");
  formdeletemedia.style.opacity = "0";
  formdeletemedia.style.visibility = "hidden";
  formdeletemediacore.style.transform = "translateY(-50px)";
}

function deleteContent(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updatecontentcode").value;
  if(portalhash == ""){
    showMsg("Sorry Security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry Code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=contentdelete',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeDeleteContent();
            getContentList();
            closeUpdateContent();
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

function doDeleteMedia(){
  var formdeletemedia = document.getElementById("formdeletemedia");
  var formdeletemediacore = document.getElementById("formdeletemediacore");
  formdeletemedia.style.opacity = "1";
  formdeletemedia.style.visibility = "visible";
  formdeletemediacore.style.transform = "translateY(0px)";
}

function closeDeleteMedia(){
  var formdeletemedia = document.getElementById("formdeletemedia");
  var formdeletemediacore = document.getElementById("formdeletemediacore");
  formdeletemedia.style.opacity = "0";
  formdeletemedia.style.visibility = "hidden";
  formdeletemediacore.style.transform = "translateY(-50px)";
}

function deleteMedia(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("viewmediacode").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=mediadelete',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getMediaList();
            closeDeleteMedia();
            closeViewMedia();
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

function copyExternalLink(){
  var copyText = document.getElementById("externallink").value;
  navigator.clipboard.writeText(copyText).then(() => {
    document.getElementById("messagemsg").innerHTML = "External link has copied to clipboard";
    document.getElementById("messagelogo").innerHTML = `<i class="bi bi-files"></i>`;
    document.getElementById("messagebtn").innerHTML = `
    <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
    `;
    var popupmsg = document.getElementById("message");
    var popupmsgcore = document.getElementById("messagecore");
    popupmsg.style.opacity = "1";
    popupmsg.style.visibility = "visible";
    popupmsgcore.style.transform = "translateY(0px)";
  });
}

function getSourceList(){
  var portalhash = localStorage.getItem("empportalhash");
  var sortby = document.getElementById("sourcesortby").value;
  var search = document.getElementById("sourcesearchinput").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=sourcelist',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          sort : sortby,
          search : search
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            dataorijson = resultParse.source;
            datajsonstring = JSON.stringify(dataorijson);
            datajson = datajsonstring;
            printPaginationSource();
            showSourceData();
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

function printPaginationSource(){
  var resultParse = JSON.parse(datajson);
  var dataHTML = ``;
  var dataLength = resultParse.length;
  if(dataLength >= 1){
    if(dataLength == 1){
      document.getElementById("totalsourcedata").innerHTML = `Result Data : 1`;
    } else {
      document.getElementById("totalsourcedata").innerHTML = `Result Datas : ${dataLength}`;
    }
    var pagetotalraw = dataLength / paginationlimit;
    var pagetotals = Math.ceil(pagetotalraw);
    pagetotal = pagetotals;
    if(pagenow == 1){
      var paginationHTML = `
      <button style="color:lightgrey;" id="paginationbtnsourcefirst"><i class="bi bi-chevron-double-left"></i></button>
      <button style="color:lightgrey;" id="paginationbtnsourceprev"><i class="bi bi-chevron-left"></i></button>
      `;
    } else {
      var paginationHTML = `
      <button onclick='goToFirstSource()' style="color:#1B1A17;" id="paginationbtnsourcefirst"><i class="bi bi-chevron-double-left"></i></button>
      <button onclick='goToPrevSource()' style="color:#1B1A17;" id="paginationbtnsourceprev"><i class="bi bi-chevron-left"></i></button>
      `;
    }
    var paginationpid = 1;
    while(paginationpid <= pagetotals){
      if(paginationpid == 1){
        var paginationpagebtnCache = `
          <button onclick='goToPageSource("${paginationpid}")' style="color:#1B1A17;" id="paginationsourcepage${paginationpid}">${paginationpid}</button>
        `;
      } else {
        var paginationpagebtnCache = `
          <button onclick='goToPageSource("${paginationpid}")' style="color:#1B1A17;" id="paginationsourcepage${paginationpid}">${paginationpid}</button>
        `;
      }
      paginationHTML = paginationHTML + paginationpagebtnCache;
      paginationpid++;
    }
    if(pagetotal == 1 || pagenow == pagetotal){
      paginationHTML = paginationHTML + `
      <button style="color:lightgrey;" id="paginationbtnsourcenext"><i class="bi bi-chevron-right"></i></button>
      <button style="color:lightgrey;" id="paginationbtnsourcelast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    } else {
      paginationHTML = paginationHTML + `
      <button onclick='goToNextSource()' style="color:#1B1A17;" id="paginationbtnsourcenext"><i class="bi bi-chevron-right"></i></button>
      <button onclick='goToLastSource()' style="color:#1B1A17;" id="paginationbtnsourcelast"><i class="bi bi-chevron-double-right"></i></button>
      `;
    }
    document.getElementById("sourcepaginationlist").innerHTML = paginationHTML;
    var activatepagenow = "paginationsourcepage" + pagenow;
    document.getElementById(activatepagenow).style.backgroundColor = "rgba(0,0,0,.1)";
  } else {
    document.getElementById("sourcepaginationlist").innerHTML = "";
    document.getElementById("totalsourcedata").innerHTML = `Result Data : 0`;
    var datalist = document.getElementById("datalist");
    datalist.innerHTML = `<i class="bi bi-emoji-frown-fill"></i> Empty Result`;
  }
}

function goToFirstSource(){
  var targetPage = 1;
  goToPageSource(targetPage);
}

function goToPrevSource(){
  var targetPage = pagenow - 1;
  goToPageSource(targetPage);
}

function goToNextSource(){
  var targetPage = pagenow + 1;
  goToPageSource(targetPage);
}

function goToLastSource(){
  var targetPage = pagetotal;
  goToPageSource(targetPage);
}

function goToPageSource(targetpage){
  pagenow = targetpage;
  printPaginationSource();
  showDataSource();
}

function showSourceData(){
  var resultParse = JSON.parse(datajson);
  var datalength = resultParse.length;
  if(datalength == 0){
    var dataHTML = `<i class="bi bi-emoji-frown-fill"></i> No data`;
  } else {
    var dataHTML = ``;
    var start = (pagenow - 1) * paginationlimit;
    var end = (pagenow * paginationlimit);
    var pid = start;
    while(pid < end && pid < datalength){

      var relayThis = ``;
      var countrelay = resultParse[pid].relay.length;
      if(countrelay == 0){
        relayThis = `- Empty Relay -`;
      } else {
        relayThis = `<table class="submodule_datadetail_core">
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Username</th>
          <th></th>
        </tr>
        `;
        var pids = 0;
        while(pids < countrelay){
          var setcolorRelay = resultParse[pid].relay[pids].status;
          if(setcolorRelay === "Active"){
            var cacheRelay = `
              <tr>
                <td>${resultParse[pid].relay[pids].name}</td>
                <td>${resultParse[pid].relay[pids].host}</td>
                <td>${resultParse[pid].relay[pids].username}</td>
                <td><button onclick='relayDetail("${resultParse[pid].relay[pids].code}")'><i class="bi bi-box-arrow-up-right"></i></button></td>
              </tr>
            `;
          } else {
            var cacheRelay = `
              <tr style="color:darkred;">
                <td>${resultParse[pid].relay[pids].name}</td>
                <td>${resultParse[pid].relay[pids].host}</td>
                <td>${resultParse[pid].relay[pids].username}</td>
                <td><button onclick='relayDetail("${resultParse[pid].relay[pids].code}")'><i class="bi bi-box-arrow-up-right"></i></button></td>
              </tr>
            `;
          }
          relayThis = relayThis + cacheRelay;
          pids++;
        }
        relayThis = relayThis + `</table>`;
      }


      var dataCache = `
      <div class="submodule_datalist_data">
        <div class="submodule_datalist_title">
          <i class="bi bi-globe2"></i> ${resultParse[pid].name}
        </div>
        <div class="submodule_datalist_config">
          <button onclick='updateSource("${resultParse[pid].code}")'><i class="bi bi-pen-fill"></i></button>
        </div>
        <div class="submodule_datalist_core">
          <div class="submodule_datalist_core_title">
            URL
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].url}
          </div>
          <div class="submodule_datalist_core_title">
            Status
          </div>
          <div class="submodule_datalist_core_sep">
            :
          </div>
          <div class="submodule_datalist_core_data">
            ${resultParse[pid].status}
          </div>
        </div>
        <div class="submodule_datadetail">
          <div class="submodule_datadetail_title">
            <i class="bi bi-pc-horizontal"></i> Relay
            <button onclick='addNewRelay("${resultParse[pid].code}")'><i class="bi bi-plus-lg"></i></button>
          </div>
          <div class="submodule_datadetail_list">
            ${relayThis}
          </div>
        </div>
      </div>
      `;
      dataHTML = dataHTML + dataCache;
      pid++;
    }
  }
  document.getElementById("datasourcelist").innerHTML = dataHTML;
}

function addNewSource(){
  var source = document.getElementById("formaddsource");
  var sourcecore = document.getElementById("formaddsourcecore");
  source.style.opacity = "1";
  source.style.visibility = "visible";
  sourcecore.style.transform = "translateY(0px)";
}

function closeNewSource(){
  var source = document.getElementById("formaddsource");
  var sourcecore = document.getElementById("formaddsourcecore");
  source.style.opacity = "0";
  source.style.visibility = "hidden";
  sourcecore.style.transform = "translateY(-50px)";
  setTimeout(function(){
    sourcecore.innerHTML = `
    <div class="form_core_nav">
      <div class="form_core_nav_title">
        <i class="bi bi-plus-circle-dotted"></i> Add New Source
      </div>
      <div class="form_core_nav_button">
        <button onclick='closeNewSource()'><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="form_core_contain">
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Name
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addsourcename"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Url
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addsourceurl"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Status
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <select id="addsourcestatus">
            <option value="">--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="form_core_contain_submit">
        <button onclick='submitNewSource()'><i class="bi bi-upload"></i> Create</button>
      </div>
    </div>
    `;
  }, 500);
}

function submitNewSource(){
  var portalhash = localStorage.getItem("empportalhash");
  var name = document.getElementById("addsourcename").value;
  var url = document.getElementById("addsourceurl").value;
  var status = document.getElementById("addsourcestatus").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(name == ""){
    showMsg("Sorry name cannot be empty!");
  } else if(url == ""){
    showMsg("Sorry url cannot be empty!");
  } else if(status == ""){
    showMsg("Sorry status cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=sourceadd',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          name : name,
          url : url,
          status : status
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getSourceList();
            closeNewSource();
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

function updateSource(code){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=sourcedetail',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            var updateHTML = `
            <div class="form_core_nav">
              <div class="form_core_nav_title">
                <i class="bi bi-pen-fill"></i> Update Source Data
              </div>
              <div class="form_core_nav_button">
                <button onclick='closeUpdateSource()'><i class="bi bi-x-lg"></i></button>
              </div>
            </div>
            <div class="form_core_contain">
              <div class="form_core_viewdel">
                <button onclick='deleteSource()'><i class="bi bi-trash-fill"></i> Delete</button>
              </div>
              <input type="hidden" id="updatesourcecode" value="${resultParse.source.code}"></input>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Name
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updatesourcename" value="${resultParse.source.name}"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Url
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updatesourceurl" value="${resultParse.source.url}"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Status
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core" id="updatesourcestatusdiv">

                </div>
              </div>
              <div class="form_core_contain_submit">
                <button onclick='submitUpdateSource()'><i class="bi bi-upload"></i> Update</button>
              </div>
            </div>
            `;
            document.getElementById("formviewsourcecore").innerHTML = updateHTML;
            var sourcestatus = resultParse.source.status;
            if(sourcestatus === "Active"){
              document.getElementById("updatesourcestatusdiv").innerHTML = `
                <select id="updatesourcestatus">
                  <option value="">--</option>
                  <option value="Active" selected>Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              `;
            } else if(sourcestatus === "Inactive"){
              document.getElementById("updatesourcestatusdiv").innerHTML = `
                <select id="updatesourcestatus">
                  <option value="">--</option>
                  <option value="Active">Active</option>
                  <option value="Inactive" selected>Inactive</option>
                </select>
              `;
            } else {
              document.getElementById("updatesourcestatusdiv").innerHTML = `
                <select id="updatesourcestatus">
                  <option value="">--</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              `;
            }
            var source = document.getElementById("formviewsource");
            var sourcecore = document.getElementById("formviewsourcecore");
            source.style.opacity = "1";
            source.style.visibility = "visible";
            sourcecore.style.transform = "translateY(0px)";
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

function closeUpdateSource(){
  var source = document.getElementById("formviewsource");
  var sourcecore = document.getElementById("formviewsourcecore");
  source.style.opacity = "0";
  source.style.visibility = "hidden";
  sourcecore.style.transform = "translateY(-50px)";
  setTimeout(function(){
    document.getElementById("formviewsourcecore").innerHTML = `
    <div class="form_core_nav">
      <div class="form_core_nav_title">
        <i class="bi bi-pen-fill"></i> Update Source Data
      </div>
      <div class="form_core_nav_button">
        <button onclick='closeUpdateSource()'><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="form_core_contain">
    <div class="form_core_viewdel">
      <button onclick='deleteSource()'><i class="bi bi-trash-fill"></i> Delete</button>
    </div>
      <input type="hidden" id="updatesourcecode" value=""></input>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Name
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="updatesourcename" value=""></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Url
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="updatesourceurl" value=""></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Status
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core" id="updatesourcestatusdiv">

        </div>
      </div>
      <div class="form_core_contain_submit">
        <button onclick='submitUpdateSource()'><i class="bi bi-upload"></i> Update</button>
      </div>
    </div>
    `;
  }, 500);
}

function submitUpdateSource(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updatesourcecode").value;
  var name = document.getElementById("updatesourcename").value;
  var url = document.getElementById("updatesourceurl").value;
  var status = document.getElementById("updatesourcestatus").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else if(name == ""){
    showMsg("Sorry name cannot be empty!");
  } else if(url == ""){
    showMsg("Sorry url cannot be empty!");
  } else if(status == ""){
    showMsg("Sorry status cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=sourceupdate',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code,
          name : name,
          url : url,
          status : status
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            getSourceList();
            closeUpdateSource();
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

function deleteSource(){
  var formdeletesource = document.getElementById("formdeletesource");
  var formdeletesourcecore = document.getElementById("formdeletesourcecore");
  formdeletesource.style.opacity = "1";
  formdeletesource.style.visibility = "visible";
  formdeletesourcecore.style.transform = "translateY(0px)";
}

function closeDeleteSource(){
  var formdeletesource = document.getElementById("formdeletesource");
  var formdeletesourcecore = document.getElementById("formdeletesourcecore");
  formdeletesource.style.opacity = "0";
  formdeletesource.style.visibility = "hidden";
  formdeletesourcecore.style.transform = "translateY(-50px)";
}

function deleteSourceConfirm(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updatesourcecode").value;
  if(portalhash == ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code == ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=sourcedelete',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeUpdateSource();
            closeDeleteSource();
            getSourceList();
          } else {
            closeDeleteSource();
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

function addNewRelay(code){
  var formaddrelay = document.getElementById("formaddrelay");
  var formaddrelaycore = document.getElementById("formaddrelaycore");
  formaddrelay.style.opacity = "1";
  formaddrelay.style.visibility = "visible";
  formaddrelaycore.style.transform = "translateY(0px)";
  document.getElementById("addrelaycode").value = code;
}

function closeNewRelay(){
  var formaddrelay = document.getElementById("formaddrelay");
  var formaddrelaycore = document.getElementById("formaddrelaycore");
  formaddrelay.style.opacity = "0";
  formaddrelay.style.visibility = "hidden";
  formaddrelaycore.style.transform = "translateY(-50px)";
  setTimeout(function(){
    document.getElementById("formaddrelaycore").innerHTML = `
    <div class="form_core_nav">
      <div class="form_core_nav_title">
        <i class="bi bi-pc-horizontal"></i> Add New Relay
      </div>
      <div class="form_core_nav_button">
        <button onclick='closeNewRelay()'><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="form_core_contain">
      <input type="hidden" id="addrelaycode" value=""></input>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Name
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayname"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          API Url
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayurl"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Host
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayhost"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Username
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayusername"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Password
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelaypassword"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          SMPTsecure
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelaysmtp"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Port
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayport"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Charset
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelaycharset"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          From Email
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayfromemail"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          From Name
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <input id="addrelayfromname"></input>
        </div>
      </div>
      <div class="form_core_contain_item">
        <div class="form_core_contain_title">
          Status
        </div>
        <div class="form_core_contain_sep">
          :
        </div>
        <div class="form_core_contain_core">
          <select id="addrelaystatus">
            <option value="">--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="form_core_contain_submit">
        <button onclick='submitNewRelay()'><i class="bi bi-upload"></i> Create</button>
      </div>
    </div>
    `;
  }, 500);
}

function submitNewRelay(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("addrelaycode").value;
  var name = document.getElementById("addrelayname").value;
  var url = document.getElementById("addrelayurl").value;
  var host = document.getElementById("addrelayhost").value;
  var username = document.getElementById("addrelayusername").value;
  var password = document.getElementById("addrelaypassword").value;
  var smtp = document.getElementById("addrelaysmtp").value;
  var port = document.getElementById("addrelayport").value;
  var charset = document.getElementById("addrelaycharset").value;
  var fromemail = document.getElementById("addrelayfromemail").value;
  var fromname = document.getElementById("addrelayfromname").value;
  var status = document.getElementById("addrelaystatus").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else if(name === ""){
    showMsg("Sorry name cannot be empty!");
  } else if(url === ""){
    showMsg("Sorry url cannot be empty!");
  } else if(host === ""){
    showMsg("Sorry host cannot be empty!");
  } else if(username === ""){
    showMsg("Sorry username cannot be empty!");
  } else if(password === ""){
    showMsg("Sorry password cannot be empty!");
  } else if(smtp === ""){
    showMsg("Sorry SMTP cannot be empty!");
  } else if(port === ""){
    showMsg("Sorry Port cannot be empty!");
  } else if(charset === ""){
    showMsg("Sorry Charset cannot be empty!");
  } else if(fromemail === ""){
    showMsg("Sorry From email cannot be empty!");
  } else if(fromname === ""){
    showMsg("Sorry From name cannot be empty!");
  } else if(status === ""){
    showMsg("Sorry Status cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=relayadd',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code,
          name : name,
          url : url,
          host : host,
          username : username,
          password : password,
          smtp : smtp,
          port : port,
          charset : charset,
          fromemail : fromemail,
          fromname : fromname,
          status : status
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeNewRelay();
            getSourceList();
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

function relayDetail(code){
  var portalhash = localStorage.getItem("empportalhash");
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=relaydetail',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            var cacheUpdateHTML = `
            <div class="form_core_nav">
              <div class="form_core_nav_title">
                <i class="bi bi-box-arrow-up-left"></i> Relay Data
              </div>
              <div class="form_core_nav_button">
                <button onclick='closeUpdateRelay()'><i class="bi bi-x-lg"></i></button>
              </div>
            </div>
            <div class="form_core_contain">
              <div class="form_core_viewdel">
                <button onclick='deleteRelay()'><i class="bi bi-trash-fill"></i> Delete</button>
              </div>
              <input type="hidden" id="updaterelaycode" value=""></input>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Name
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayname"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  API Url
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayurl"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Host
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayhost"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Username
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayusername"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Password
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelaypassword"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  SMPTsecure
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelaysmtp"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Port
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayport"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Charset
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelaycharset"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  From Email
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayfromemail"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  From Name
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <input id="updaterelayfromname"></input>
                </div>
              </div>
              <div class="form_core_contain_item">
                <div class="form_core_contain_title">
                  Status
                </div>
                <div class="form_core_contain_sep">
                  :
                </div>
                <div class="form_core_contain_core">
                  <select id="updaterelaystatus">
                    <option value="">--</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="form_core_contain_submit">
                <button onclick='submitUpdateRelay()'><i class="bi bi-upload"></i> Update</button>
              </div>
            </div>
            `;
            document.getElementById("formupdaterelaycore").innerHTML = cacheUpdateHTML;
            document.getElementById("updaterelaycode").value = resultParse.relay.code;
            document.getElementById("updaterelayname").value = resultParse.relay.name;
            document.getElementById("updaterelayurl").value = resultParse.relay.url;
            document.getElementById("updaterelayhost").value = resultParse.relay.host;
            document.getElementById("updaterelayusername").value = resultParse.relay.username;
            document.getElementById("updaterelaypassword").value = resultParse.relay.password;
            document.getElementById("updaterelaysmtp").value = resultParse.relay.smtp;
            document.getElementById("updaterelayport").value = resultParse.relay.port;
            document.getElementById("updaterelaycharset").value = resultParse.relay.charset;
            document.getElementById("updaterelayfromemail").value = resultParse.relay.fromemail;
            document.getElementById("updaterelayfromname").value = resultParse.relay.fromname;
            document.getElementById("updaterelaystatus").value = resultParse.relay.status;
            var formupdaterelay = document.getElementById("formupdaterelay");
            var formupdaterelaycore = document.getElementById("formupdaterelaycore");
            formupdaterelay.style.opacity = "1";
            formupdaterelay.style.visibility = "visible";
            formupdaterelaycore.style.transform = "translateY(0px)";
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

function closeUpdateRelay(){
  var formupdaterelay = document.getElementById("formupdaterelay");
  var formupdaterelaycore = document.getElementById("formupdaterelaycore");
  formupdaterelay.style.opacity = "0";
  formupdaterelay.style.visibility = "hidden";
  formupdaterelaycore.style.transform = "translateY(-50px)";
}

function submitUpdateRelay(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updaterelaycode").value;
  var name = document.getElementById("updaterelayname").value;
  var url = document.getElementById("updaterelayurl").value;
  var host = document.getElementById("updaterelayhost").value;
  var username = document.getElementById("updaterelayusername").value;
  var password = document.getElementById("updaterelaypassword").value;
  var smtp = document.getElementById("updaterelaysmtp").value;
  var port = document.getElementById("updaterelayport").value;
  var charset = document.getElementById("updaterelaycharset").value;
  var fromemail = document.getElementById("updaterelayfromemail").value;
  var fromname = document.getElementById("updaterelayfromname").value;
  var status = document.getElementById("updaterelaystatus").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else if(name === ""){
    showMsg("Sorry name cannot be empty!");
  } else if(url === ""){
    showMsg("Sorry url cannot be empty!");
  } else if(host === ""){
    showMsg("Sorry host cannot be empty!");
  } else if(username === ""){
    showMsg("Sorry username cannot be empty!");
  } else if(password === ""){
    showMsg("Sorry password cannot be empty!");
  } else if(smtp === ""){
    showMsg("Sorry smtp cannot be empty!");
  } else if(port === ""){
    showMsg("Sorry port cannot be empty!");
  } else if(charset === ""){
    showMsg("Sorry charset cannot be empty!");
  } else if(fromemail === ""){
    showMsg("Sorry from email cannot be empty!");
  } else if(fromname === ""){
    showMsg("Sorry from name cannot be empty!");
  } else if(status === ""){
    showMsg("Sorry cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=relayupdate',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code,
          name : name,
          url : url,
          host : host,
          username : username,
          password : password,
          smtp : smtp,
          port : port,
          charset : charset,
          fromemail : fromemail,
          fromname : fromname,
          status : status
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeUpdateRelay();
            getSourceList();
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

function deleteRelay(){
  var formdeleterelay = document.getElementById("formdeleterelay");
  var formdeleterelaycore = document.getElementById("formdeleterelaycore");
  formdeleterelay.style.opacity = "1";
  formdeleterelay.style.visibility = "visible";
  formdeleterelaycore.style.transform = "translateY(0px)";
}

function closeDeleteRelay(){
  var formdeleterelay = document.getElementById("formdeleterelay");
  var formdeleterelaycore = document.getElementById("formdeleterelaycore");
  formdeleterelay.style.opacity = "0";
  formdeleterelay.style.visibility = "hidden";
  formdeleterelaycore.style.transform = "translateY(-50px)";
}

function deleteRelayConfirm(){
  var portalhash = localStorage.getItem("empportalhash");
  var code = document.getElementById("updaterelaycode").value;
  if(portalhash === ""){
    showMsg("Sorry security key cannot be empty!");
  } else if(code === ""){
    showMsg("Sorry code cannot be empty!");
  } else {
    try{
      $.ajax({
        url: apidir + 'newsletter.php?do=relaydelete',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer indraco.WEBDEV'
        },
        data : {
          hash : portalhash,
          code : code
        },
        success: function(result){
          var resultParse = JSON.parse(result);
          var resultStatus = resultParse.status;
          var resultMessage = resultParse.message;
          if(resultStatus === "Success"){
            document.getElementById("messagemsg").innerHTML = resultMessage;
            document.getElementById("messagelogo").innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            document.getElementById("messagebtn").innerHTML = `
            <button onclick='closeMsg()' class="popup_msg_core_btnclose">OK</button>
            `;
            var popupmsg = document.getElementById("message");
            var popupmsgcore = document.getElementById("messagecore");
            popupmsg.style.opacity = "1";
            popupmsg.style.visibility = "visible";
            popupmsgcore.style.transform = "translateY(0px)";
            closeDeleteRelay();
            closeUpdateRelay();
            getSourceList();
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

//Close Load
closeLoad();
