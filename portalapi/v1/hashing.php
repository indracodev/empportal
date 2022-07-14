<?php
include "auth.php";
$do = $_GET["do"];
$status = "failed";
$pesan = "";
$daJson = array();

if($do == "generate"){
  if(!isset($_POST["agent"])){
    $pesan = "Sorry! no input detected!";
  } else {
    $inputAgent = addslashes($_POST["agent"]);
    if($inputAgent == ""){
      $pesan = "Sorry! user agent is empty!";
    } else {
      include "dbinitialcore.php";
      //Delete Yesterday Hash
      $dateNow = date("Y-m-d")." 00:00:00";
      $dblink->query("DELETE FROM hash WHERE hash_made < '".$dateNow."' ");
      //Giving Hash
      $genCode = "HSH-".rand(100,999).date("Ymd")."YST".rand(1000,9999);
      $hashCode = hash("sha256", $genCode);
      $getIsset = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$hashCode."' ");
      $countIsset = $getIsset->num_rows;
      while($countIsset != 0){
        $genCode = "HSH-".rand(100,999).date("Ymd")."YST".rand(1000,9999);
        $hashCode = hash("sha256", $genCode);
        $getIsset = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$hashCode."' ");
        $countIsset = $getIsset->num_rows;
      }
      $dblink->query("INSERT INTO hash VALUES(NULL, '".$hashCode."', NULL, '".$inputAgent."', NOW(), NOW(), 'Guest')");
      $daJson["hash"]["code"] = $hashCode;
      $status = "Success";
      $pesan = "Hash has been generated";
    }
  }
} else if($do == "status"){
  if(!isset($_POST["hash"])){
    $pesan = "Sorry! no security key input detected!";
  } else if(!isset($_POST["agent"])){
    $pesan = "Sorry! no client input detected!";
  } else {
    $inputHash = $_POST["hash"];
    $inputAgent = $_POST["agent"];
    if($inputHash == ""){
      $pesan = "Sorry! security key cannot be empty!";
    } else if($inputAgent == ""){
      $pesan = "Sorry! Agent cannot be empty!";
    } else {
      include "dbinitialcore.php";
      $getHash = $dblink->query("SELECT * FROM hash WHERE hash_code = '".$inputHash."' ");
      $countHash = $getHash->num_rows;
      if($countHash != 1){
        $pesan = "Sorry! your session has expired!";
      } else {
        $fetchHash = $getHash->fetch_assoc();
        $resClient = $fetchHash["hash_client"];
        if($resClient != $inputAgent){
          $pesan = "Device changing! reload app or refresh this page";
        } else {
          $dblink->query("UPDATE hash SET hash_lastactive = NOW() WHERE hash_code = '".$inputHash."' ");
          $resultStatus = $fetchHash["hash_status"];
          $daJson["hashstat"]["status"] = $resultStatus;
          $pesan = "Hash data loaded";
          $status = "Success";
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
