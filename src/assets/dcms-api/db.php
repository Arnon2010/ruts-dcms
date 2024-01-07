<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json");

// $hostAuth = "localhost";
// $userAuth = "root";
// $passAuth = "arnonrmutsv";
// $database = "studycheck";

$hostAuth = "linuxdb2.rmutsv.ac.th";
$userAuth = "root";
$passAuth = ",miLiu;b=yp48";
$database = "dcmsdb";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $database);

if ($conn->connect_error) {
    die("Connection failed: ");
} else {
    mysqli_set_charset($conn, "utf8");
}

