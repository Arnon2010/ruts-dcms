<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);
$faculty_code = $dataFrm->faculty_code;
$user_id = $dataFrm->user_id;
$outsider_code = $dataFrm->outsider_code;
$prefix_name = $dataFrm->prefix_name;
$user_epassport = $dataFrm->user_epassport;
$outsider_fname = $dataFrm->outsider_fname;
$outsider_lname = $dataFrm->outsider_lname;
$outsider_position = $dataFrm->outsider_position;
$outsider_agency = $dataFrm->outsider_agency;
$outsider_email = $dataFrm->outsider_email;
$outsider_phone = $dataFrm->outsider_phone;
$outsider_username = $dataFrm->outsider_username;
$outsider_password = $dataFrm->outsider_password;
$action_submit = $dataFrm->action_submit;

$outsider_date = date('Y-m-d H:i:s');

if($action_submit == 'Insert') {
    $sql = "INSERT INTO mt_outsider SET
    prefix_name = '$prefix_name',
    outsider_fname = '$outsider_fname',
    outsider_lname =  '$outsider_lname',
    outsider_position = '$outsider_position',
    outsider_agency = '$outsider_agency',
    outsider_email = '$outsider_email',
    outsider_phone = '$outsider_phone',
    outsider_username = '$outsider_username',
    outsider_password = '$outsider_password',
    outsider_date = '$outsider_date',
    faculty_code = '$faculty_code',
    user_id = '$user_id'
    ";
} else {
    $sql = "UPDATE mt_outsider SET
    prefix_name = '$prefix_name',
    outsider_fname = '$outsider_fname',
    outsider_lname =  '$outsider_lname',
    outsider_position = '$outsider_position',
    outsider_agency = '$outsider_agency',
    outsider_email = '$outsider_email',
    outsider_phone = '$outsider_phone',
    outsider_username = '$outsider_username',
    outsider_password = '$outsider_password',
    outsider_date = '$outsider_date',
    faculty_code = '$faculty_code',
    user_id = '$user_id'
    WHERE outsider_code = '$outsider_code'";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
    // Add $rows_regis to array
    $obj->status = 'Ok';
    $obj->resp = '';
    $rows = $obj;
} else {
    $obj->status = 'No';
    $obj->resp = '';
    $rows = $obj;
}

header("Access-Control-Allow-Origin: *");
header("content-type:text/javascript;charset=utf-8");
header("Content-Type: application/json; charset=utf-8", true, 200);

print json_encode($rows);

$conn->close();
