<?php
include "auth.php";
$do = $_GET["do"];
$status = "failed";
$pesan = "";
$daJson = array();

if($do == "check"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else if(!isset($_POST["username"])){
    $pesan = "Sorry! no username input found!";
  } else if(!isset($_POST["password"])){
    $pesan = "Sorry! no password input found!";
  } else {
    $inputHash = $_POST["hash"];
    $inputUsername = $_POST["username"];
    $inputPassword = addslashes($_POST["password"]);
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputUsername == ""){
      $pesan = "Sorry! username cannot be empty!";
    } else if($inputPassword == ""){
      $pesan = "Sorry! password cannot be empty!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬]/', $inputHash)){
      $pesan = "Sorry! security key input invalid!";
    } else if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬]/', $inputUsername)){
      $pesan = "Sorry! username input invalid!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! no security key listed!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $userID = $fetchHash["emp_code"];
        if($userID != ""){
          $pesan = "Sorry! you are already logged in";
        } else {
          $keyCode = "SupBack22-";
          $passConv = $keyCode.$inputPassword;
          $passHash = hash("sha256",$passConv);

          $getUser = $dblink->prepare("SELECT * FROM emp WHERE emp_uname = ? AND emp_pwd = ? ");
          $getUser->bind_param("ss", $inputUsername, $passHash);
          $getUser->execute();
          $resUser = $getUser->get_result();
          $countUser = $resUser->num_rows;
          if($countUser != 1){
            $pesan = "Incorrect user or password";
          } else {
            $getSucUser = $dblink->query("SELECT * FROM emp WHERE emp_uname = '".$inputUsername."' AND emp_pwd = '".$passHash."' ");
            $fetchSucUser = $getSucUser->fetch_assoc();
            $empCode = $fetchSucUser["emp_code"];
            $getDetail = $dblink->query("SELECT * FROM empdetail WHERE emp_code = '".$empCode."' ");
            $countDetail = $getDetail->num_rows;
            if($countDetail != 1){
              $pesan = "Error! Unidentified user!";
            } else {
              $dblink->query("UPDATE hash SET emp_code = '".$empCode."', hash_status = 'Logged In' WHERE hash_code = '".$inputHash."' ");
              $fetchDetail = $getDetail->fetch_assoc();
              $nickname = $fetchDetail["empdetail_nickname"];
              $status = "Success";
              $pesan = "Welcome back ".$nickname."!";
            }
          }

        }
      }
    }
  }
} else {
  $pesan = "Sorry! no action detected!";
}

$daJson["message"] = $pesan;
$daJson["status"] = $status;
$printJson = json_encode($daJson);
echo $printJson;
exit();
?>
