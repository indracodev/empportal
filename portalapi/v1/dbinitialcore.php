<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "empportalv1";

// Create connection
$dblink = new mysqli($servername, $username, $password, $database);
// Check connection
if ($dblink->connect_error) {
    die("Connection failed: " . $dblink->connect_error);
}
?>
