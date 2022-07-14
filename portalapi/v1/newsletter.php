<?php
include "auth.php";
$do = $_GET["do"];
$status = "failed";
$pesan = "";
$daJson = array();

if($do == "getmaillist"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["sort"])){
    $pesan = "Sorry! no sort input found!";
  } else if(!isset($_POST["search"])){
    $pesan = "Sorry! no search input found!";
  } else if(!isset($_POST["source"])){
    $pesan = "Sorry! no source input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputSort = $_POST["sort"];
    $inputSearch = $_POST["search"];
    $inputSource = $_POST["source"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."'");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          if($inputSource == "all"){
            $sql = "SELECT * FROM blastemaillist ";
            if($inputSearch != ""){
              $sql = $sql."WHERE blastemaillist_email LIKE '%".$inputSearch."%' OR blastemaillist_name LIKE '%".$inputSearch."%' ";
            }
            if($inputSort != ""){
              $sql = $sql."ORDER BY blastemaillist_email ".$inputSort;
            }
            $getMailList = $dblink->query($sql);
            $countMailList = $getMailList->num_rows;
            if($countMailList == 0){
              $daJson["maillist"] = "";
            } else {
              $pid = 0;
              while($fetchMailList = $getMailList->fetch_assoc()){
                $daJson["maillist"][$pid]["code"] = $fetchMailList["blastemaillist_code"];
                $daJson["maillist"][$pid]["email"] = $fetchMailList["blastemaillist_email"];
                $daJson["maillist"][$pid]["name"] = $fetchMailList["blastemaillist_name"];
                $daJson["maillist"][$pid]["role"] = $fetchMailList["blastemaillist_role"];
                $pid++;
              }
            }
          } else {
            $sql = "SELECT * FROM blastemaillist ";
            if($inputSearch != ""){
              $sql = $sql."WHERE blastemaillist_email LIKE '%".$inputSearch."%' OR blastemaillist_name LIKE '%".$inputSearch."%' ";
            }
            if($inputSort != ""){
              $sql = $sql."ORDER BY blastemaillist_email ".$inputSort;
            }
            $getMailList = $dblink->query($sql);
            $countMailList = $getMailList->num_rows;
            if($countMailList == 0){
              $daJson["maillist"] = "";
            } else {
              $pid = 0;
              while($fetchMailList = $getMailList->fetch_assoc()){
                $thisCodes = $fetchMailList["blastemaillist_code"];
                $getSource = $dblink->query("SELECT * FROM blastemaillist_source WHERE blastemaillist_code = '".$thisCodes."' AND blastsource_code = '".$inputSource."' ");
                $countSource = $getSource->num_rows;
                if($countSource == 1){
                  $fetchSource = $getSource->fetch_assoc();
                  $daJson["maillist"][$pid]["code"] = $fetchMailList["blastemaillist_code"];
                  $daJson["maillist"][$pid]["email"] = $fetchMailList["blastemaillist_email"];
                  $daJson["maillist"][$pid]["name"] = $fetchMailList["blastemaillist_name"];
                  $daJson["maillist"][$pid]["role"] = $fetchMailList["blastemaillist_role"];
                  $daJson["maillist"][$pid]["subscribe"] = $fetchSource["blastemaillist_source_subscribe"];
                  $pid++;
                }
              }
            }
          }
          $status = "Success";
          $pesan = "Data loaded";
        }
      }
    }
  }
} else if($do == "getemailsource"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else {
    $inputHash = $_POST["hash"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."'");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_datedelete IS NULL AND blastsource_status = 'Active' ");
          $countSource = $getSource->num_rows;
          if($countSource == 0){
            $daJson["source"] = "";
            $status = "Success";
            $pesan = "Source loaded!";
          } else {
            $pid = 0;
            while($fetchSource = $getSource->fetch_assoc()){
              $daJson["source"][$pid]["code"] = $fetchSource["blastsource_code"];
              $daJson["source"][$pid]["name"] = $fetchSource["blastsource_name"];
              $pid++;
            }
            $status = "Success";
            $pesan = "Source loaded!";
          }
        }
      }
    }
  }
} else if($do == "addnewemail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["email"])){
    $pesan = "Sorry! no email input found!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input found!";
  } else if(!isset($_POST["role"])){
    $pesan = "Sorry! no role input found!";
  } else if(!isset($_POST["source"])){
    $pesan = "Sorry! no source input found!";
  } else if(!isset($_POST["subscribe"])){
    $pesan = "Sorry! no subscribe input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputEmail = $_POST["email"];
    $inputName = $_POST["name"];
    $inputRole = $_POST["role"];
    $inputSourceOri = $_POST["source"];
    $inputSubscribeOri = $_POST["subscribe"];
    $inputSource = json_decode($inputSourceOri);
    $inputSourceCount = count($inputSource);
    $inputSubscribe = json_decode($inputSubscribeOri);
    $inputSubscribeCounte = count($inputSubscribe);
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputEmail == ""){
      $pesan = "Sorry! email cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! name cannot be empty!";
    } else if($inputRole == ""){
      $pesan = "Sorry! role cannot be empty!";
    } else if($inputSourceCount == 0){
      $pesan = "Sorry! source must be choosen!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $inputHash)){
      $pesan = "Sorry! security key contain special character!";
    } else if(preg_match('/[\'^£$%&*()}{#~?><>,|=+¬-]/', $inputEmail)){
      $pesan = "Sorry! email contain special character!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $inputRole)){
      $pesan = "Sorry! role contain special character!";
    } else {
      include "dbinitialcore.php";
      $checkHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $checkHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $checkHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $checkIsset = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_email = '".$inputEmail."' ");
          $countIsset = $checkIsset->num_rows;
          if($countIsset != 0){
            $pesan = "Sorry! this email already available!";
          } else {
            $genCode = "EML-".rand(100,999)."MNL".rand(1000000,9999999);
            $checkCode = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_code = '".$genCode."' ");
            $countCheckCode = $checkCode->num_rows;
            while($countCheckCode != 0){
              $genCode = "EML-".rand(100,999)."MNL".rand(1000000,9999999);
              $checkCode = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_code = '".$genCode."' ");
              $countCheckCode = $checkCode->num_rows;
            }
            $dblink->query("INSERT INTO blastemaillist VALUES(NULL, '".$genCode."', '".$inputEmail."', '".$inputName."', '".$inputRole."', NOW(), NULL, NULL)");
            $pid = 0;
            while($pid < $inputSourceCount){
              $thisSource = $inputSource[$pid];
              if(in_array($thisSource, $inputSubscribe)) {
                $subscribeStatus = "Subscribe";
              } else {
                $subscribeStatus = "Unsubscribe";
              }
              $dblink->query("INSERT INTO blastemaillist_source VALUES(NULL, '".$genCode."', '".$thisSource."', '".$subscribeStatus."', NOW(), NULL, NULL) ");
              $pid++;
            }
            $status = "Success";
            $pesan = "Successfully added new email";
          }
        }
      }
    }
  }
} else if($do == "viewemail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $checkHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $checkHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key listed!";
      } else {
        $fetchHash = $checkHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getEmail = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_code = '".$inputCode."' ");
          $countEmail = $getEmail->num_rows;
          if($countEmail != 1){
            $pesan = "Sorry! no email found!";
          } else {
            $fetchEmail = $getEmail->fetch_assoc();
            $emailListCode = $fetchEmail["blastemaillist_code"];
            $daJson["email"]["code"] = $emailListCode;
            $daJson["email"]["email"] = $fetchEmail["blastemaillist_email"];
            $daJson["email"]["name"] = $fetchEmail["blastemaillist_name"];
            $daJson["email"]["role"] = $fetchEmail["blastemaillist_role"];
            $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_datedelete IS NULL ");
            $countSource = $getSource->num_rows;
            if($countSource == 0){
              $daJson["email"]["source"] = "";
            } else {
              $pid = 0;
              while($fetchSource = $getSource->fetch_assoc()){
                $thisSourceCode = $fetchSource["blastsource_code"];
                $getSourceActual = $dblink->query("SELECT * FROM blastemaillist_source WHERE blastsource_code = '".$thisSourceCode."' AND blastemaillist_code = '".$emailListCode."' AND blastemaillist_source_timedeleted IS NULL ");
                $countSourceActual = $getSourceActual->num_rows;
                if($countSourceActual == 1){
                  $thisSourceStatus = "Active";
                  $fetchSourceActual = $getSourceActual->fetch_assoc();
                  $thisSubscribe = $fetchSourceActual["blastemaillist_source_subscribe"];
                } else {
                  $thisSourceStatus = "Inactive";
                  $thisSubscribe = "Unsubscribe";
                }
                $daJson["email"]["source"][$pid]["code"] = $thisSourceCode;
                $daJson["email"]["source"][$pid]["name"] = $fetchSource["blastsource_name"];
                $daJson["email"]["source"][$pid]["status"] = $thisSourceStatus;
                $daJson["email"]["source"][$pid]["subscribe"] = $thisSubscribe;
                $pid++;
              }
            }
            $status = "Success";
            $pesan = "Data loaded!";
          }
        }
      }
    }
  }
} else if($do == "updateemail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else if(!isset($_POST["email"])){
    $pesan = "Sorry! no email input found!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input found!";
  } else if(!isset($_POST["role"])){
    $pesan = "Sorry! no role input found!";
  } else if(!isset($_POST["source"])){
    $pesan = "Sorry! no source input found!";
  } else if(!isset($_POST["subscribe"])){
    $pesan = "Sorry! no subscribe input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    $inputEmail = $_POST["email"];
    $inputName = $_POST["name"];
    $inputRole = $_POST["role"];
    $inputSourceOri = $_POST["source"];
    $inputSource = json_decode($inputSourceOri);
    $inputSourceCount = count($inputSource);
    $inputSubscribeOri = $_POST["subscribe"];
    if($inputSubscribeOri != ""){
      $inputSubscribe = json_decode($inputSubscribeOri);
    } else {
      $inputSubscribe = array();
    }
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else if($inputEmail == ""){
      $pesan = "Sorry! email cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! name cannot be empty!";
    } else if($inputRole == ""){
      $pesan = "Sorry! role must be choosen!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $inputHash)){
      $pesan = "Sorry! security key contain special character!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬]/', $inputCode)){
      $pesan = "Sorry! code contain special character!";
    } else if(preg_match('/[\'^£$%&*()}{#~?><>,|=+¬]/', $inputEmail)){
      $pesan = "Sorry! email contain special character!";
    } else if(preg_match('/[\'^£$%&*}{@#~?><>,|=_+¬-]/', $inputName)){
      $pesan = "Sorry! name contain special character!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $inputRole)){
      $pesan = "Sorry! role contain special character!";
    } else {
      include "dbinitialcore.php";
      $checkHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $checkHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $checkHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $checkEmail = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_code = '".$inputCode."' ");
          $countEmail = $checkEmail->num_rows;
          if($countEmail != 1){
            $pesan = "Sorry! this email is unavailable";
          } else {
            $dblink->query("UPDATE blastemaillist SET blastemaillist_email = '".$inputEmail."', blastemaillist_name = '".$inputName."', blastemaillist_role = '".$inputRole."', blastemaillist_timemodified = NOW() WHERE blastemaillist_code = '".$inputCode."' ");

            //Unset Unselect
            $getAllSource = $dblink->query("SELECT * FROM blastemaillist_source WHERE blastemaillist_code = '".$inputCode."' ");
            $countAllSource = $getAllSource->num_rows;
            if($countAllSource == 0){
              $pesan = "There was an error with your database!";
              $daJson["message"] = $pesan;
              $daJson["status"] = $status;
              $printJson = json_encode($daJson);
              echo $printJson;
              exit();
            } else {
              while($fetchAllSource = $getAllSource->fetch_assoc()){
                $allSourceCode = $fetchAllSource["blastsource_code"];
                if(!in_array($allSourceCode,$inputSource)){
                  $allSourceID = $fetchAllSource["blastemaillist_source_id"];
                  $dblink->query("UPDATE blastemaillist_source SET blastemaillist_source_subscribe = 'Unsubscribe', blastemaillist_source_timedeleted = NOW() WHERE blastemaillist_source_id = '".$allSourceID."' ");
                }
              }
            }
            //Set Updated Data
            $pid = 0;
            while($pid < $inputSourceCount){
              $thisSourceCode = $inputSource[$pid];
              $getIssetSource = $dblink->query("SELECT * FROM blastemaillist_source WHERE blastemaillist_code = '".$inputCode."' AND blastsource_code = '".$thisSourceCode."' ");
              $countIssetSource = $getIssetSource->num_rows;
              if($countIssetSource == 0){
                if(in_array($thisSourceCode, $inputSubscribe)){
                  $subscribeStatus = "Subscribe";
                } else {
                  $subscribeStatus = "Unsubscribe";
                }
                $dblink->query("INSERT INTO blastemaillist_source VALUES(NULL, '".$inputCode."', '".$thisSourceCode."', '".$subscribeStatus."', NOW(), NULL, NULL)");
              } else if($countIssetSource == 1){
                $fetchIssetSource = $getIssetSource->fetch_assoc();
                $targetMailSourceID = $fetchIssetSource["blastemaillist_source_id"];
                if(in_array($thisSourceCode, $inputSubscribe)){
                  $subscribeStatus = "Subscribe";
                } else {
                  $subscribeStatus = "Unsubscribe";
                }
                $dblink->query("UPDATE blastemaillist_source SET blastemaillist_source_timedeleted = NULL, blastemaillist_source_timemodified = NOW(), blastemaillist_source_subscribe = '".$subscribeStatus."' WHERE blastemaillist_source_id = '".$targetMailSourceID."' ");
              }
              $pid++;
            }
            $status = "Success";
            $pesan = "Successfully updated email data";
          }
        }
      }
    }
  }
} else if($do == "listcontent"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key found!";
  } else if(!isset($_POST["search"])){
    $pesan = "Sorry! no search input found";
  } else if(!isset($_POST["sort"])){
    $pesan = "Sorry! no sort input found";
  } else {
    $inputHash = $_POST["hash"];
    $inputSearch = $_POST["search"];
    $inputSort = $_POST["sort"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $sql = "SELECT * FROM blastcontent ";
          if($inputSearch != ""){
            $sql = $sql."WHERE blastcontent_title LIKE '%".$inputSearch."%' OR blastcontent_webtarget LIKE '%".$inputSearch."%' ";
          }
          if($inputSort != ""){
            if($inputSort == "ASC" || $inputSort == "DESC"){
              $sortSql = "ORDER BY blastcontent_title ".$inputSort;
            } else {
              if($inputSort == "Latest"){
                $sortSql = "ORDER BY blastcontent_id DESC";
              } else if($inputSort == "Oldest"){
                $sortSql = "ORDER BY blastcontent_id ASC";
              } else {
                $sortSql = "ORDER BY blastcontent_id DESC";
              }
            }
          } else {
            $sortSql = "ORDER BY blastcontent_id DESC";
          }
          $sql = $sql.$sortSql;
          $getContent = $dblink->query($sql);
          $countContent = $getContent->num_rows;
          if($countContent == 0){
            $daJson["content"] = "";
          } else {
            $pid = 0;
            while($fetchContent = $getContent->fetch_assoc()){
              $daJson["content"][$pid]["code"] = $fetchContent["blastcontent_code"];
              $daJson["content"][$pid]["title"] = $fetchContent["blastcontent_title"];
              $daJson["content"][$pid]["targettime"] = $fetchContent["blastcontent_targettime"];
              $daJson["content"][$pid]["web"] = $fetchContent["blastcontent_webtarget"];
              $daJson["content"][$pid]["status"] = $fetchContent["blastcontent_status"];
              $pid++;
            }
          }
          $status = "Success";
          $pesan = "Data loaded";
        }
      }
    }
  }
} else if($do == "submitcontent"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["title"])){
    $pesan = "Sorry! no title input found!";
  } else if(!isset($_POST["subject"])){
    $pesan = "Sorry! no subject input found!";
  } else if(!isset($_POST["type"])){
    $pesan = "Sorry! no type input found!";
  } else if(!isset($_POST["content"])){
    $pesan = "Sorry! no content input found!";
  } else if(!isset($_POST["targettime"])){
    $pesan = "Sorry! no target time input found!";
  } else if(!isset($_POST["web"])){
    $pesan = "Sorry! no web input found!";
  } else if(!isset($_POST["note"])){
    $pesan = "Sorry! no note input found!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input found!";
  } else {
    $inputHash        = $_POST["hash"];
    $inputTitle       = $_POST["title"];
    $inputSubject     = $_POST["subject"];
    $inputType        = $_POST["type"];
    $inputContent     = addslashes($_POST["content"]);
    $inputTargettime  = $_POST["targettime"];
    $inputWeb         = $_POST["web"];
    $inputNote        = addslashes($_POST["note"]);
    $inputStatus      = $_POST["status"];
    if(isset($_FILES["attachment"])){
      $inputAttachment  = $_FILES["attachment"];
    } else {
      $inputAttachment  = "";
    }
    $dibolehkan       = array('image/png', 'image/jpg', 'image/jpeg', 'image/ico', 'application/pdf');
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputTitle == ""){
      $pesan = "Sorry! title cannot be empty!";
    } else if($inputSubject == ""){
      $pesan = "Sorry! subject cannot be empty!";
    } else if($inputType == ""){
      $pesan = "Sorry! type cannot be empty!";
    } else if($inputContent == ""){
      $pesan = "Sorry! content cannot be empty!";
    } else if($inputTargettime == ""){
      $pesan = "Sorry! target time cannot be empty!";
    } else if($inputWeb == ""){
      $pesan = "Sorry! web cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! status cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key cannot be empty!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in";
        } else {
          $getTitle = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_title = '".$inputTitle."' ");
          $countTitle = $getTitle->num_rows;
          if($countTitle != 0){
            $pesan = "Sorry! title already exists!";
          } else {
            if($inputAttachment != ""){
              if(!in_array($_FILES["attachment"]['type'],$dibolehkan)){
                $pesan = "Sorry! picture must be jpg, png or pdf format";
                $daJson["message"] = $pesan;
                $daJson["status"] = $status;
                $printJson = json_encode($daJson);
                echo $printJson;
                exit();
              } else {
                $fileImgPath = "../portalasset/newsletter/attachment/";
                $fileImgNameOrig = pathinfo($_FILES['attachment']['name'], PATHINFO_FILENAME);
                $fileImgExt = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
                $fileImgSize = $_FILES['attachment']['size'];
                $fileImgName = hash('sha256',$fileImgNameOrig);
                if($fileImgSize > 5000000){
                  $pesan = "Sorry! branch picture is too large";
                  $daJson["message"] = $pesan;
                  $daJson["status"] = $status;
                  $printJson = json_encode($daJson);
                  echo $printJson;
                  exit();
                } else {
                  $fileImgInc = "";
                  while(file_exists($fileImgPath.$fileImgName.$fileImgInc.".".$fileImgExt)){
                    $fileImgInc++;
                  }
                  $fileImgBasename = $fileImgName.$fileImgInc.".".$fileImgExt;
                  $imgPath = $fileImgPath.$fileImgBasename;
                  move_uploaded_file($inputAttachment["tmp_name"],$imgPath);
                  $attachmentFile = "portalasset/newsletter/attachment/".$fileImgBasename;
                }
              }
            } else {
              $attachmentFile = NULL;
            }
            //Code
            $codeContent = "NWS-".rand(100,999)."LTR".rand(1000,9999);
            $checkCode = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_code = '".$codeContent."' ");
            $countCode = $checkCode->num_rows;
            while($countCode != 0){
              $codeContent = "NWS-".rand(100,999)."LTR".rand(1000,9999);
              $checkCode = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_code = '".$codeContent."' ");
              $countCode = $checkCode->num_rows;
            }
            //Slug
            $slugifyURL = slugify($inputSubject);
            $urlAssembly = $inputWeb.$slugifyURL;
            //Send DB
            $dblink->query("INSERT INTO blastcontent VALUES(
              NULL,
              '".$codeContent."',
              '".$inputTitle."',
              '".$inputSubject."',
              '".$inputContent."',
              '".$inputType."',
              '".$attachmentFile."',
              '".$inputTargettime."',
              '".$inputWeb."',
              '".$inputNote."',
              '".$inputStatus."',
              NOW(),
              '".$urlAssembly."',
              '".$empCode."'
            )");
            $status = "Success";
            $pesan = "Successfully add new newsletter";
          }
        }
      }
    }
  }
} else if($do == "contentdetail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getContent = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_code = '".$inputCode."' ");
          $countContent = $getContent->num_rows;
          if($countContent != 1){
            $pesan = "Sorry! content not found!";
          } else {
            $fetchContent = $getContent->fetch_assoc();
            $daJson["content"]["code"] = $fetchContent["blastcontent_code"];
            $daJson["content"]["title"] = $fetchContent["blastcontent_title"];
            $daJson["content"]["subject"] = $fetchContent["blastcontent_subject"];
            $daJson["content"]["content"] = $fetchContent["blastcontent_content"];
            $daJson["content"]["type"] = $fetchContent["blastcontent_type"];
            $daJson["content"]["attachment"] = $fetchContent["blastcontent_attachment"];
            $daJson["content"]["targettime"] = $fetchContent["blastcontent_targettime"];
            $daJson["content"]["webtarget"] = $fetchContent["blastcontent_webtarget"];
            $daJson["content"]["note"] = $fetchContent["blastcontent_note"];
            $daJson["content"]["status"] = $fetchContent["blastcontent_status"];
            $daJson["content"]["url"] = $fetchContent["blastcontent_url"];
            $status = "Success";
            $pesan = "Data loaded";
          }
        }
      }
    }
  }
} else if($do == "contentupdate"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no seccurity key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else if(!isset($_POST["title"])){
    $pesan = "Sorry! no title input detected!";
  } else if(!isset($_POST["subject"])){
    $pesan = "Sorry! no subject input detected!";
  } else if(!isset($_POST["type"])){
    $pesan = "Sorry! no type input detected!";
  } else if(!isset($_POST["content"])){
    $pesan = "Sorry! no content input detected!";
  } else if(!isset($_POST["targettime"])){
    $pesan = "Sorry! no target time input detected!";
  } else if(!isset($_POST["web"])){
    $pesan = "Sorry! no web input detected!";
  } else if(!isset($_POST["note"])){
    $pesan = "Sorry! no note input detected!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input detected!";
  } else {
    $inputHash        = $_POST["hash"];
    $inputCode        = $_POST["code"];
    $inputTitle       = $_POST["title"];
    $inputSubject     = $_POST["subject"];
    $inputType        = $_POST["type"];
    $inputContent     = addslashes($_POST["content"]);
    $inputTargettime  = $_POST["targettime"];
    $inputWeb         = $_POST["web"];
    $inputNote        = addslashes($_POST["note"]);
    $inputStatus      = $_POST["status"];
    if(isset($_FILES["attachment"])){
      $inputAttachment  = $_FILES["attachment"];
    } else {
      $inputAttachment  = "";
    }
    $dibolehkan       = array('image/png', 'image/jpg', 'image/jpeg', 'image/ico', 'application/pdf');
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else if($inputTitle == ""){
      $pesan = "Sorry! title cannot be empty!";
    } else if($inputSubject == ""){
      $pesan = "Sorry! subject cannot be empty!";
    } else if($inputType == ""){
      $pesan = "Sorry! type must be choosen!";
    } else if($inputContent == ""){
      $pesan = "Sorry! content cannot be empty!";
    } else if($inputTargettime == ""){
      $pesan = "Sorry! target time cannot be empty!";
    } else if($inputWeb == ""){
      $pesan = "Sorry! web target cannot be empty!";
    } else if($inputNote == ""){
      $pesan = "Sorry! note cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! status must be choosen!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getContent = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_code = '".$inputCode."' ");
          $countContent = $getContent->num_rows;
          if($countContent != 1){
            $pesan = "Sorry! no content has found";
          } else {
            if($inputAttachment != ""){
              if(!in_array($_FILES["attachment"]['type'],$dibolehkan)){
                $pesan = "Sorry! picture must be jpg, png or pdf format";
                $daJson["message"] = $pesan;
                $daJson["status"] = $status;
                $printJson = json_encode($daJson);
                echo $printJson;
                exit();
              } else {
                $fileImgPath = "../portalasset/newsletter/attachment/";
                $fileImgNameOrig = pathinfo($_FILES['attachment']['name'], PATHINFO_FILENAME);
                $fileImgExt = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
                $fileImgSize = $_FILES['attachment']['size'];
                $fileImgName = hash('sha256',$fileImgNameOrig);
                if($fileImgSize > 5000000){
                  $pesan = "Sorry! branch picture is too large";
                  $daJson["message"] = $pesan;
                  $daJson["status"] = $status;
                  $printJson = json_encode($daJson);
                  echo $printJson;
                  exit();
                } else {
                  //Delete Original
                  $fetchContent = $getContent->fetch_assoc();
                  $fileOri = $fetchContent["blastcontent_attachment"];
                  $fileOri = "../".$fileOri;
                  unlink($fileOri);
                  //Update File
                  $fileImgInc = "";
                  while(file_exists($fileImgPath.$fileImgName.$fileImgInc.".".$fileImgExt)){
                    $fileImgInc++;
                  }
                  $fileImgBasename = $fileImgName.$fileImgInc.".".$fileImgExt;
                  $imgPath = $fileImgPath.$fileImgBasename;
                  move_uploaded_file($inputAttachment["tmp_name"],$imgPath);
                  $attachmentFile = "portalasset/newsletter/attachment/".$fileImgBasename;
                  $dblink->query("UPDATE blastcontent SET blastcontent_attachment = '".$attachmentFile."' WHERE blastcontent_code = '".$inputCode."' ");
                }
              }
            }
            //Slug
            $slugifyURL = slugify($inputSubject);
            $urlAssembly = $inputWeb.$slugifyURL;
            //Update
            $dblink->query("UPDATE blastcontent SET
              blastcontent_title = '".$inputTitle."',
              blastcontent_subject = '".$inputSubject."',
              blastcontent_type = '".$inputType."',
              blastcontent_content = '".$inputContent."',
              blastcontent_targettime = '".$inputTargettime."',
              blastcontent_webtarget = '".$inputWeb."',
              blastcontent_note = '".$inputNote."',
              blastcontent_status = '".$inputStatus."',
              blastcontent_url = '".$urlAssembly."'
            WHERE blastcontent_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Content successfully updated!";
          }
        }
      }
    }
  }
} else if($do == "medialist"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["sort"])){
    $pesan = "Sorry! no sort input detected!";
  } else if(!isset($_POST["search"])){
    $pesan = "Sorry! no search input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputSort = $_POST["sort"];
    $inputSearch = $_POST["search"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $sql = "SELECT * FROM blastmedia ";
          if($inputSearch != ""){
            $sql = $sql."WHERE blastmedia_title LIKE '%".$inputSearch."%' ";
          }
          if($inputSort != ""){
            if($inputSort == "ASC"){
              $sql = $sql."ORDER BY blastmedia_name ADC";
            } else if($inputSort == "DESC"){
              $sql = $sql."ORDER BY blastmedia_name DESC";
            } else if($inputSort == "Latest"){
              $sql = $sql."ORDER BY blastmedia_id DESC";
            } else if($inputSort == "Oldest"){
              $sql = $sql."ORDER BY blastmedia_id ASC";
            } else {
              $sql = $sql."ORDER BY blastmedia_id DESC";
            }
          }
          $getMedia = $dblink->query($sql);
          $countMedia = $getMedia->num_rows;
          if($countMedia == 0){
            $daJson["media"] = "";
          } else {
            $pid = 0;
            while($fetchMedia = $getMedia->fetch_assoc()){
              $daJson["media"][$pid]["code"] = $fetchMedia["blastmedia_code"];
              $daJson["media"][$pid]["title"] = $fetchMedia["blastmedia_title"];
              $daJson["media"][$pid]["url"] = $fetchMedia["blastmedia_url"];
              $daJson["media"][$pid]["desc"] = $fetchMedia["blastmedia_desc"];
              $daJson["media"][$pid]["status"] = $fetchMedia["blastmedia_status"];
              $pid++;
            }
          }
          $status = "Success";
          $pesan = "Data loaded!";
        }
      }
    }
  }
} else if($do == "mediaadd"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no input found!";
  } else if(!isset($_POST["title"])){
    $pesan = "Sorry! no title input found!";
  } else if(!isset($_FILES["media"])){
    $pesan = "Sorry! media cannot be empty!";
  } else if(!isset($_POST["desc"])){
    $pesan = "Sorry! no description input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputTitle = $_POST["title"];
    $inputMedia  = $_FILES["media"];
    $inputDesc = addslashes($_POST["desc"]);
    $dibolehkan       = array('image/png', 'image/jpg', 'image/jpeg', 'image/ico', 'application/pdf', 'video/mp4', 'video/avi');
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputTitle == ""){
      $pesan = "Sorry! title cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          if(!in_array($_FILES["media"]['type'],$dibolehkan)){
            $pesan = "Sorry! media must be jpg, png, mp4, avi or pdf format";
            $daJson["message"] = $pesan;
            $daJson["status"] = $status;
            $printJson = json_encode($daJson);
            echo $printJson;
            exit();
          } else {
            $fileImgPath = "../portalasset/newsletter/media/";
            $fileImgNameOrig = pathinfo($_FILES['media']['name'], PATHINFO_FILENAME);
            $fileImgExt = pathinfo($_FILES['media']['name'], PATHINFO_EXTENSION);
            $fileImgSize = $_FILES['media']['size'];
            $fileImgName = hash('sha256',$fileImgNameOrig);
            if($fileImgSize > 50000000){
              $pesan = "Sorry! media is too large";
              $daJson["message"] = $pesan;
              $daJson["status"] = $status;
              $printJson = json_encode($daJson);
              echo $printJson;
              exit();
            } else {
              $titleCheck = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_title = '".$inputTitle."' ");
              $countCheck = $titleCheck->num_rows;
              if($countCheck != 0){
                $pesan = "Sorry! media with this title already exists";
              } else {
                $fileImgInc = "";
                while(file_exists($fileImgPath.$fileImgName.$fileImgInc.".".$fileImgExt)){
                  $fileImgInc++;
                }
                $fileImgBasename = $fileImgName.$fileImgInc.".".$fileImgExt;
                $imgPath = $fileImgPath.$fileImgBasename;
                move_uploaded_file($inputMedia["tmp_name"],$imgPath);
                $attachmentFile = "portalasset/newsletter/media/".$fileImgBasename;

                $mediaCode = "MDA-".rand(1000,9999).date("Ymd").rand(1000,9999);
                $checkCode = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_code = '".$mediaCode."' ");
                $countCode = $checkCode->num_rows;
                while($countCode != 0){
                  $mediaCode = "MDA-".rand(1000,9999).date("Ymd").rand(1000,9999);
                  $checkCode = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_code = '".$mediaCode."' ");
                  $countCode = $checkCode->num_rows;
                }
                $dblink->query("INSERT INTO blastmedia VALUES(NULL, '".$mediaCode."', '".$inputTitle."', '".$attachmentFile."', '".$inputDesc."', 'Active')");
                $status = "Success";
                $pesan = "Successfully added new media";
              }
            }
          }
        }
      }
    }
  }
} else if($do == "mediaview"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $checkHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $checkHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key listed!";
      } else {
        $fetchHash = $checkHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getMedia = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_code = '".$inputCode."' ");
          $countMedia = $getMedia->num_rows;
          if($countMedia != 1){
            $pesan = "Sorry! media not found!";
          } else {
            $fetchMedia = $getMedia->fetch_assoc();
            $daJson["media"]["code"] = $fetchMedia["blastmedia_code"];
            $daJson["media"]["title"] = $fetchMedia["blastmedia_title"];
            $daJson["media"]["url"] = $fetchMedia["blastmedia_url"];
            $daJson["media"]["desc"] = $fetchMedia["blastmedia_desc"];
            $daJson["media"]["status"] = $fetchMedia["blastmedia_status"];
            $status = "Success";
            $pesan = "Data loaded!";
          }
        }
      }
    }
  }
} else if($do == "mediaupdate"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else if(!isset($_POST["title"])){
    $pesan = "Sorry! no title input detected!";
  } else if(!isset($_POST["desc"])){
    $pesan = "Sorry! no desc input detected!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    $inputTitle = $_POST["title"];
    if(!isset($_FILES["media"])){
      $inputMedia = "";
    } else {
      $inputMedia = $_FILES["media"];
    }
    $inputDesc = addslashes($_POST["desc"]);
    $inputStatus = $_POST["status"];
    $dibolehkan       = array('image/png', 'image/jpg', 'image/jpeg', 'image/ico', 'application/pdf');
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else if($inputTitle == ""){
      $pesan = "Sorry! title cannot be empty!";
    } else if($inputDesc == ""){
      $pesan = "Sorry! desc cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! status cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getMedia = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_code = '".$inputCode."' ");
          $countMedia = $getMedia->num_rows;
          if($countMedia != 1){
            $pesan = "Sorry this media doesnt exists";
          } else {
            $checkTitle = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_title = '".$inputTitle."' ");
            $countTitle = $checkTitle->num_rows;
            if($countTitle != 0){
              if($countTitle == 1){
                $fetchTitle = $checkTitle->fetch_assoc();
                $titleIssetCode = $fetchTitle["blastmedia_code"];
                if($titleIssetCode == $inputCode){
                  $titleStatus = "OK";
                } else {
                  $titleStatus = "Fail";
                  $pesan = "Sorry! this title already exists!";
                }
              } else {
                $titleStatus = "Fail";
                $pesan = "Sorry! there was an error with this title!";
              }
            } else {
              $titleStatus = "OK";
            }
            if($titleStatus == "OK"){
              if($inputMedia != ""){
                if(!in_array($_FILES["media"]['type'],$dibolehkan)){
                  $pesan = "Sorry! media must be jpg, png, mp4, avi or pdf format";
                  $daJson["message"] = $pesan;
                  $daJson["status"] = $status;
                  $printJson = json_encode($daJson);
                  echo $printJson;
                  exit();
                } else {
                  $fileImgPath = "../portalasset/newsletter/media/";
                  $fileImgNameOrig = pathinfo($_FILES['media']['name'], PATHINFO_FILENAME);
                  $fileImgExt = pathinfo($_FILES['media']['name'], PATHINFO_EXTENSION);
                  $fileImgSize = $_FILES['media']['size'];
                  $fileImgName = hash('sha256',$fileImgNameOrig);
                  if($fileImgSize > 50000000){
                    $pesan = "Sorry! media is too large";
                    $daJson["message"] = $pesan;
                    $daJson["status"] = $status;
                    $printJson = json_encode($daJson);
                    echo $printJson;
                    exit();
                  } else {
                    $fetchMedia = $getMedia->fetch_assoc();
                    $oldMedia = "../".$fetchMedia["blastmedia_url"];
                    unlink($oldMedia);
                    $fileImgInc = "";
                    while(file_exists($fileImgPath.$fileImgName.$fileImgInc.".".$fileImgExt)){
                      $fileImgInc++;
                    }
                    $fileImgBasename = $fileImgName.$fileImgInc.".".$fileImgExt;
                    $imgPath = $fileImgPath.$fileImgBasename;
                    move_uploaded_file($inputMedia["tmp_name"],$imgPath);
                    $attachmentFile = "portalasset/newsletter/media/".$fileImgBasename;
                    $dblink->query("UPDATE blastmedia SET blastmedia_url = '".$attachmentFile."' WHERE blastmedia_code = '".$inputCode."' ");
                  }
                }
              }
              $dblink->query("UPDATE blastmedia SET
                blastmedia_title = '".$inputTitle."',
                blastmedia_desc = '".$inputDesc."',
                blastmedia_status = '".$inputStatus."'
              WHERE blastmedia_code = '".$inputCode."' ");
              $status = "Success";
              $pesan = "Media successfully updated!";
            }
          }
        }
      }
    }
  }
} else if($do == "emaildelete"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $checkEmail = $dblink->query("SELECT * FROM blastemaillist WHERE blastemaillist_code = '".$inputCode."' ");
          $countEmail = $checkEmail->num_rows;
          if($countEmail != 1){
            $pesan = "Sorry! email account doesnt exists!";
          } else {
            $dblink->query("DELETE FROM blastemaillist WHERE blastemaillist_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Email account has been deleted!";
          }
        }
      }
    }
  }
} else if($do == "contentdelete"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key not listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getContent = $dblink->query("SELECT * FROM blastcontent WHERE blastcontent_code = '".$inputCode."' ");
          $countContent = $getContent->num_rows;
          if($countContent != 1){
            $pesan = "Sorry! content is not available!";
          } else {
            $fetchContent = $getContent->fetch_assoc();
            $contentAttachment = $fetchContent["blastcontent_attachment"];
            if($contentAttachment != ""){
              $attachmentTarget = "../".$contentAttachment;
              unlink($attachmentTarget);
            }
            $dblink->query("DELETE FROM blastcontent WHERE blastcontent_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Content has been deleted!";
          }
        }
      }
    }
  }
} else if($do == "mediadelete"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no input code detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getMedia = $dblink->query("SELECT * FROM blastmedia WHERE blastmedia_code = '".$inputCode."' ");
          $countMedia = $getMedia->num_rows;
          if($countMedia != 1){
            $pesan = "Sorry! media not found!";
          } else {
            $fetchMedia = $getMedia->fetch_assoc();
            $mediaOld = "../".$fetchMedia["blastmedia_url"];
            unlink($mediaOld);
            $dblink->query("DELETE FROM blastmedia WHERE blastmedia_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Media has been deleted!";
          }
        }
      }
    }
  }
} else if($do == "sourcelist"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["sort"])){
    $pesan = "Sorry! no sort key input detected!";
  } else if(!isset($_POST["search"])){
    $pesan = "Sorry! no search key input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputSort = $_POST["sort"];
    $inputSearch = $_POST["search"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! employee not found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $sql = "SELECT * FROM blastsource WHERE blastsource_datedelete IS NULL ";
          if($inputSort != ""){
            if($inputSort == "ASC"){
              $sql = $sql."ORDER BY blastsource_name ASC";
            } else if($inputSort == "DESC"){
              $sql = $sql."ORDER BY blastsource_name DESC";
            } else if($inputSort == "Latest"){
              $sql = $sql."ORDER BY blastsource_id DESC";
            } else if($inputSort == "Oldest"){
              $sql = $sql."ORDER BY blastsource_id ASC";
            } else {

            }
          }
          $getSource = $dblink->query($sql);
          $countSource = $getSource->num_rows;
          if($countSource == 0){
            $daJson["source"] = "";
            $status = "Success";
            $pesan = "Data loaded";
          } else {
            $pid = 0;
            while($fetchSource = $getSource->fetch_assoc()){
              $sourceCode = $fetchSource["blastsource_code"];
              $daJson["source"][$pid]["code"] = $sourceCode;
              $daJson["source"][$pid]["name"] = $fetchSource["blastsource_name"];
              $daJson["source"][$pid]["url"] = $fetchSource["blastsource_url"];
              $daJson["source"][$pid]["status"] = $fetchSource["blastsource_status"];
              $sqlRelay = "SELECT * FROM blastrelay ";
              if($inputSearch != ""){
                $sqlRelay = $sqlRelay."WHERE blastsource_code = '".$sourceCode."' AND blastrelay_name LIKE '%".$inputSearch."%' AND blastrelay_timedelete IS NULL OR blastsource_code = '".$sourceCode."' AND blastrelay_username LIKE '%".$inputSearch."%' AND blastrelay_timedelete IS NULL ";
              } else {
                $sqlRelay = $sqlRelay."WHERE blastsource_code = '".$sourceCode."' AND blastrelay_timedelete IS NULL ";
              }
              if($inputSort != ""){
                if($inputSort == "ASC"){
                  $sqlRelay = $sqlRelay."ORDER BY blastrelay_name ASC";
                } else if($inputSort == "DESC"){
                  $sqlRelay = $sqlRelay."ORDER BY blastrelay_name DESC";
                } else if($inputSort == "Latest"){
                  $sqlRelay = $sqlRelay."ORDER BY blastrelay_id DESC";
                } else if($inputSort == "Oldest"){
                  $sqlRelay = $sqlRelay."ORDER BY blastrelay_id ASC";
                } else {

                }
              }
              $getRelay = $dblink->query($sqlRelay);
              $countRelay = $getRelay->num_rows;
              if($countRelay == 0){
                $daJson["source"][$pid]["relay"] = "";
              } else {
                $pids = 0;
                while($fetchRelay = $getRelay->fetch_assoc()){
                  $daJson["source"][$pid]["relay"][$pids]["code"] = $fetchRelay["blastrelay_code"];
                  $daJson["source"][$pid]["relay"][$pids]["name"] = $fetchRelay["blastrelay_name"];
                  $daJson["source"][$pid]["relay"][$pids]["host"] = $fetchRelay["blastrelay_host"];
                  $daJson["source"][$pid]["relay"][$pids]["username"] = $fetchRelay["blastrelay_username"];
                  $daJson["source"][$pid]["relay"][$pids]["status"] = $fetchRelay["blastrelay_status"];
                  $pids++;
                }
              }
              $pid++;
            }
            $status = "Success";
            $pesan = "Data loaded";
          }
        }
      }
    }
  }
} else if($do == "sourceadd"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input found!";
  } else if(!isset($_POST["url"])){
    $pesan = "Sorry! no url input found!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputName = $_POST["name"];
    $inputUrl = $_POST["url"];
    $inputStatus = $_POST["status"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! name cannot be empty!";
    } else if($inputUrl == ""){
      $pesan = "Sorry! url cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! status cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $hashCode = $fetchHash["hash_code"];
        if($hashCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          //Gen Code
          $genCode = "SRC-".rand(100,999)."CYW".rand(1000,9999);
          $checkCode = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$genCode."' ");
          $countCode = $checkCode->num_rows;
          while($countCode != 0){
            $genCode = "SRC-".rand(100,999)."CYW".rand(1000,9999);
            $checkCode = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$genCode."' ");
            $countCode = $checkCode->num_rows;
          }
          $dblink->query("INSERT INTO blastsource VALUES(NULL, '".$genCode."', '".$inputName."', '".$inputUrl."', '".$inputStatus."', NOW(), NULL, NULL)");
          $status = "Success";
          $pesan = "New source has successfully added!";
        }
      }
    }
  }
} else if($do == "sourcedetail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$inputCode."' ");
          $countSource = $getSource->num_rows;
          if($countSource == 0){
            $pesan = "Sorry! this source is not available!";
          } else {
            $fetchSource = $getSource->fetch_assoc();
            $daJson["source"]["code"] = $fetchSource["blastsource_code"];
            $daJson["source"]["name"] = $fetchSource["blastsource_name"];
            $daJson["source"]["url"] = $fetchSource["blastsource_url"];
            $daJson["source"]["status"] = $fetchSource["blastsource_status"];
            $status = "Success";
            $pesan = "Data loaded";
          }
        }
      }
    }
  }
} else if($do == "sourceupdate"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input detected!";
  } else if(!isset($_POST["url"])){
    $pesan = "Sorry! no url input detected!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    $inputName = $_POST["name"];
    $inputUrl = $_POST["url"];
    $inputStatus = $_POST["status"];
    if($inputHash == ""){
      $pesan = "Sorry! cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! cannot be empty!";
    } else if($inputUrl == ""){
      $pesan = "Sorry! cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$inputCode."' ");
          $countSource = $getSource->num_rows;
          if($countSource != 1){
            $pesan = "Sorry! source not found!";
          } else {
            $dblink->query("UPDATE blastsource SET blastsource_name = '".$inputName."', blastsource_url = '".$inputUrl."', blastsource_status = '".$inputStatus."' WHERE blastsource_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Source data successfully updated";
          }
        }
      }
    }
  }
} else if($do == "sourcedelete"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! code key input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$inputCode."' ");
          $countSource = $getSource->num_rows;
          if($countSource != 1){
            $pesan = "Sorry! source not found!";
          } else {
            $getRelay = $dblink->query("SELECT * FROM blastrelay WHERE blastsource_code = '".$inputCode."' AND blastrelay_timedelete IS NULL ");
            $countRelay = $getRelay->num_rows;
            if($countRelay != 0){
              $pesan = "Sorry! cannot delete this source, there is still an active relay detected!";
            } else {
              $dblink->query("UPDATE blastsource SET blastsource_datedelete = NOW() WHERE blastsource_code = '".$inputCode."' ");
              $status = "Success";
              $pesan = "Source successfully deleted!";
            }
          }
        }
      }
    }
  }
} else if($do == "relayadd"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input found!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input found!";
  } else if(!isset($_POST["url"])){
    $pesan = "Sorry! no url input found!";
  } else if(!isset($_POST["host"])){
    $pesan = "Sorry! no host input found!";
  } else if(!isset($_POST["username"])){
    $pesan = "Sorry! no username input found!";
  } else if(!isset($_POST["password"])){
    $pesan = "Sorry! no password input found!";
  } else if(!isset($_POST["smtp"])){
    $pesan = "Sorry! no smtp input found!";
  } else if(!isset($_POST["port"])){
    $pesan = "Sorry! no port input found!";
  } else if(!isset($_POST["charset"])){
    $pesan = "Sorry! no charset input found!";
  } else if(!isset($_POST["fromemail"])){
    $pesan = "Sorry! no from email input found!";
  } else if(!isset($_POST["fromname"])){
    $pesan = "Sorry! no from name input found!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input found!";
  } else {
    $inputHash      = $_POST["hash"];
    $inputCode      = $_POST["code"];
    $inputName      = $_POST["name"];
    $inputUrl       = $_POST["url"];
    $inputHost      = $_POST["host"];
    $inputUsername  = $_POST["username"];
    $inputPassword  = $_POST["password"];
    $inputSMTP      = $_POST["smtp"];
    $inputPort      = $_POST["port"];
    $inputCharset   = $_POST["charset"];
    $inputFromEmail = $_POST["fromemail"];
    $inputFromName  = $_POST["fromname"];
    $inputStatus    = $_POST["status"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! name cannot be empty!";
    } else if($inputUrl == ""){
      $pesan = "Sorry! url cannot be empty!";
    } else if($inputHost == ""){
      $pesan = "Sorry! host cannot be empty!";
    } else if($inputUsername == ""){
      $pesan = "Sorry! username cannot be empty!";
    } else if($inputPassword == ""){
      $pesan = "Sorry! password cannot be empty!";
    } else if($inputSMTP == ""){
      $pesan = "Sorry! smtp cannot be empty!";
    } else if($inputPort == ""){
      $pesan = "Sorry! port cannot be empty!";
    } else if($inputCharset == ""){
      $pesan = "Sorry! charset cannot be empty!";
    } else if($inputFromEmail == ""){
      $pesan = "Sorry! From email cannot be empty!";
    } else if($inputFromName == ""){
      $pesan = "Sorry! From name cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! status cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! security key unavailable!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getSource = $dblink->query("SELECT * FROM blastsource WHERE blastsource_code = '".$inputCode."' ");
          $countSource = $getSource->num_rows;
          if($countSource != 1){
            $pesan = "Sorry! source not found!";
          } else {
            $relayCode = "RLY-".rand(100,999)."SB".rand(1000,9999);
            $getRelayCode = $dblink->query("SELECT * FROM blastrelay WHERE blastrelay_code = '".$relayCode."' ");
            $countRelayCode = $getRelayCode->num_rows;
            while($countRelayCode != 0){
              $relayCode = "RLY-".rand(100,999)."SB".rand(1000,9999);
              $getRelayCode = $dblink->query("SELECT * FROM blastrelay WHERE blastrelay_code = '".$relayCode."' ");
              $countRelayCode = $getRelayCode->num_rows;
            }
            $dblink->query("INSERT INTO blastrelay VALUES(NULL, '".$relayCode."', '".$inputName."', '".$inputCode."', '".$inputUrl."', '".$inputHost."', '".$inputUsername."', '".$inputPassword."', '".$inputSMTP."', '".$inputPort."', '".$inputCharset."', '".$inputFromEmail."', '".$inputFromName."', '".$inputStatus."', NOW(), NULL, NULL)");
            $status = "Success";
            $pesan = "New relay successfully created";
          }
        }
      }
    }
  }
} else if($do == "relaydetail"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getRelay = $dblink->query("SELECT * FROM blastrelay WHERE blastrelay_code = '".$inputCode."' ");
          $countRelay = $getRelay->num_rows;
          if($countRelay != 1){
            $pesan = "Sorry! no blast data found!";
          } else {
            $fetchRelay = $getRelay->fetch_assoc();
            $daJson["relay"]["code"] = $fetchRelay["blastrelay_code"];
            $daJson["relay"]["name"] = $fetchRelay["blastrelay_name"];
            $daJson["relay"]["url"] = $fetchRelay["blastrelay_apiurl"];
            $daJson["relay"]["host"] = $fetchRelay["blastrelay_host"];
            $daJson["relay"]["username"] = $fetchRelay["blastrelay_username"];
            $daJson["relay"]["password"] = $fetchRelay["blastrelay_password"];
            $daJson["relay"]["smtp"] = $fetchRelay["blastrelay_smtpsecure"];
            $daJson["relay"]["port"] = $fetchRelay["blastrelay_port"];
            $daJson["relay"]["charset"] = $fetchRelay["blastrelay_charset"];
            $daJson["relay"]["fromemail"] = $fetchRelay["blastrelay_fromemail"];
            $daJson["relay"]["fromname"] = $fetchRelay["blastrelay_fromname"];
            $daJson["relay"]["status"] = $fetchRelay["blastrelay_status"];
            $status = "Success";
            $pesan = "Relay data loaded";
          }
        }
      }
    }
  }
} else if($do == "relayupdate"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else if(!isset($_POST["name"])){
    $pesan = "Sorry! no name input detected!";
  } else if(!isset($_POST["url"])){
    $pesan = "Sorry! no url input detected!";
  } else if(!isset($_POST["host"])){
    $pesan = "Sorry! no host input detected!";
  } else if(!isset($_POST["username"])){
    $pesan = "Sorry! no username input detected!";
  } else if(!isset($_POST["password"])){
    $pesan = "Sorry! no password input detected!";
  } else if(!isset($_POST["smtp"])){
    $pesan = "Sorry! no smtp input detected!";
  } else if(!isset($_POST["port"])){
    $pesan = "Sorry! no port input detected!";
  } else if(!isset($_POST["charset"])){
    $pesan = "Sorry! no charset input detected!";
  } else if(!isset($_POST["fromemail"])){
    $pesan = "Sorry! no from email input detected!";
  } else if(!isset($_POST["fromname"])){
    $pesan = "Sorry! no from name input detected!";
  } else if(!isset($_POST["status"])){
    $pesan = "Sorry! no status input detected!";
  } else {
    $inputHash      = $_POST["hash"];
    $inputCode      = $_POST["code"];
    $inputName      = $_POST["name"];
    $inputUrl       = $_POST["url"];
    $inputHost      = $_POST["host"];
    $inputUsername  = $_POST["username"];
    $inputPassword  = $_POST["password"];
    $inputSMTP      = $_POST["smtp"];
    $inputPort      = $_POST["port"];
    $inputCharset   = $_POST["charset"];
    $inputFromEmail = $_POST["fromemail"];
    $inputFromName  = $_POST["fromname"];
    $inputStatus    = $_POST["status"];
    if($inputHash == ""){
      $pesan = "Sorry! Security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! Code cannot be empty!";
    } else if($inputName == ""){
      $pesan = "Sorry! Name cannot be empty!";
    } else if($inputUrl == ""){
      $pesan = "Sorry! Url cannot be empty!";
    } else if($inputHost == ""){
      $pesan = "Sorry! Host cannot be empty!";
    } else if($inputUsername == ""){
      $pesan = "Sorry! Username cannot be empty!";
    } else if($inputPassword == ""){
      $pesan = "Sorry! Password cannot be empty!";
    } else if($inputSMTP == ""){
      $pesan = "Sorry! SMTP cannot be empty!";
    } else if($inputPort == ""){
      $pesan = "Sorry! Port cannot be empty!";
    } else if($inputCharset == ""){
      $pesan = "Sorry! Charset cannot be empty!";
    } else if($inputFromEmail == ""){
      $pesan = "Sorry! From Email cannot be empty!";
    } else if($inputFromName == ""){
      $pesan = "Sorry! From Name cannot be empty!";
    } else if($inputStatus == ""){
      $pesan = "Sorry! Status must be choosen!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getRelay = $dblink->query("SELECT * FROM blastrelay WHERE blastrelay_code = '".$inputCode."' ");
          $countRelay = $getRelay->num_rows;
          if($countRelay != 1){
            $pesan = "Sorry! relay is not found!";
          } else {
            $dblink->query("UPDATE blastrelay SET
              blastrelay_name = '".$inputName."',
              blastrelay_apiurl = '".$inputUrl."',
              blastrelay_host = '".$inputHost."',
              blastrelay_username = '".$inputUsername."',
              blastrelay_password = '".$inputPassword."',
              blastrelay_smtpsecure = '".$inputSMTP."',
              blastrelay_port = '".$inputPort."',
              blastrelay_charset = '".$inputCharset."',
              blastrelay_fromemail = '".$inputFromEmail."',
              blastrelay_fromname = '".$inputFromName."',
              blastrelay_status = '".$inputStatus."',
              blastrelay_timemodify = NOW()
            WHERE blastrelay_code = '".$inputCode."' ");
            $status = "Success";
            $pesan = "Data successfully updated!";
          }
        }
      }
    }
  }
} else if($do == "relaydelete"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["code"])){
    $pesan = "Sorry! no code input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputCode = $_POST["code"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputCode == ""){
      $pesan = "Sorry! code cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key found!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $empCode = $fetchHash["emp_code"];
        if($empCode == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getRelay = $dblink->query("SELECT * FROM blastrelay WHERE blastrelay_code = '".$inputCode."' ");
          $countRelay = $getRelay->num_rows;
          if($countRelay != 1){
            $pesan = "Sorry! no relay found!";
          } else {
            $fetchRelay = $getRelay->fetch_assoc();
            $relayDeleteStat = $fetchRelay["blastrelay_timedelete"];
            if($relayDeleteStat != ""){
              $pesan = "Sorry! relay already deleted!";
            } else {
              $dblink->query("UPDATE blastrelay SET blastrelay_timedelete = NOW() WHERE blastrelay_code = '".$inputCode."' ");
              $status = "Success";
              $pesan = "Relay successfully deleted!";
            }
          }
        }
      }
    }
  }
} else {
  $pesan = "Sorry! no action detected!";
}

function slugify($urlString) {
  //$search = array('Ș', 'Ț', 'ş', 'ţ', 'Ş', 'Ţ', 'ș', 'ț', 'î', 'â', 'ă', 'Î', ' ', 'Ă', 'ë', 'Ë');
  //$replace = array('s', 't', 's', 't', 's', 't', 's', 't', 'i', 'a', 'a', 'i', 'a', 'a', 'e', 'E');
  //$str = str_ireplace($search, $replace, strtolower(trim($urlString)));
  $str = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $urlString), '-'));
  return $str;
}

$daJson["message"] = $pesan;
$daJson["status"] = $status;
$printJson = json_encode($daJson);
echo $printJson;
exit();
?>
