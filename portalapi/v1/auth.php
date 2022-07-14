<?php
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, VIEW");
header("Access-Control-Allow-Headers: Authorization");

//if(!isset(apache_request_headers()['Authorization'])){
//  $pesan = "No Auth";
//  echo $pesan;
//  exit();
//}

if(!isset(apache_request_headers()['Authorization'])){
  $pesan = "No Auth";
  echo $pesan;
  exit();
}

$authorization = explode(" ", apache_request_headers()['Authorization']);
$authheadhash = $authorization[1];
$authheadhashes = explode(".", $authheadhash);

$headauthuname = $authheadhashes[0];
$headauthpass = $authheadhashes[1];

$headauthharduser = "indraco";
$headauthhardpass = "WEBDEV";

if($headauthuname != $headauthharduser){
  header('HTTP/1.1 401 Unauthorized');
  exit;
} else {
  if($headauthpass != $headauthhardpass){
    header('HTTP/1.1 401 Unauthorized');
    exit;
  }
}
?>
