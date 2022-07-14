<?php
include "auth.php";
$do = $_GET["do"];
$status = "failed";
$pesan = "";
$daJson = array();

if($do == "navbar"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else {
    $inputHash = $_POST["hash"];
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
        $userID = $fetchHash["emp_code"];
        if($userID == ""){
          $pesan = "Sorry! you are not logged in!";
        } else {
          $getEmp = $dblink->query("SELECT * FROM emp WHERE emp_code = '".$userID."' ");
          $countEmp = $getEmp->num_rows;
          if($countEmp != 1){
            $pesan = "Sorry! no employee data listed";
          } else {
            $fetchEmp = $getEmp->fetch_assoc();
            $employeeCode = $fetchEmp["emp_code"];
            $roleCode = $fetchEmp["role_code"];
            $getDetailEmp = $dblink->query("SELECT * FROM empdetail WHERE emp_code = '".$employeeCode."' ");
            $countDetailEmp = $getDetailEmp->num_rows;
            if($countDetailEmp != 1){
              $pesan = "No Employee data";
            } else {
              $fetchDetailEmp = $getDetailEmp->fetch_assoc();
              $nickname = $fetchDetailEmp["empdetail_nickname"];
              $profilepic = $fetchDetailEmp["empdetail_pp"];
              $getRole = $dblink->query("SELECT * FROM role WHERE role_code = '".$roleCode."' ");
              $countRole = $getRole->num_rows;
              if($countRole != 1){
                $pesan = "Sorry! role not listed";
              } else {
                $fetchRole = $getRole->fetch_assoc();
                $roleName = $fetchRole["role_name"];
                $roleList = $fetchRole["role_modulelist"];
                $daJson["navbardata"]["nickname"] = $nickname;
                $daJson["navbardata"]["profilepict"] = $profilepic;
                $daJson["navbardata"]["rolename"] = $roleName;
                $daJson["navbardata"]["modules"] = $roleList;
                $status = "Success";
                $pesan = "navbar loaded";
              }
            }
          }
        }
      }
    }
  }
} else if($do == "logout"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input found!";
  } else {
    $inputHash = $_POST["hash"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
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
          $pesan = "Sorry! you are not logged in";
        } else{
          $dblink->query("UPDATE hash SET hash_status = 'Logged Out' WHERE hash_code = '".$inputHash."' ");
          $status = "Success";
          $pesan = "Successfully logged out";
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
