<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$user_id = $dataFrm->user_id;
$user_epassport = $dataFrm->user_epassport;
//$user_password = $dataFrm->user_password;
$user_password = 'Auth';
$user_fname = $dataFrm->user_fname;
$user_lname = $dataFrm->user_lname;
$user_role = $dataFrm->user_role;
$faculty_code = $dataFrm->faculty_code;
$faculty_name = $dataFrm->faculty_name;
$action_submit = $dataFrm->action_submit;

if($action_submit == 'Insert') {
    $sql = "INSERT INTO mt_user SET
    user_epassport = '$user_epassport',
    user_password = '$user_password',
    user_fname =  '$user_fname',
    user_lname = '$user_lname',
    user_role = '$user_role',
    faculty_code = '$faculty_code',
    faculty_name = '$faculty_name'
    ";
} else {
    $sql = "UPDATE mt_user SET
    user_epassport = '$user_epassport',
    user_fname =  '$user_fname',
    user_lname = '$user_lname',
    user_role = '$user_role',
    faculty_code = '$faculty_code',
    faculty_name = '$faculty_name'
    WHERE user_id = '$user_id' ";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
    // Add $rows_regis to array
    $obj->status = 'Ok';
    $rows = $obj;
} else {
    $obj->status = 'No';
    $rows = $obj;
}

header("Access-Control-Allow-Origin: *");
header("content-type:text/javascript;charset=utf-8");
header("Content-Type: application/json; charset=utf-8", true, 200);

print json_encode($rows);

$conn->close();
