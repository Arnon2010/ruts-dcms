<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$meeting_code = $dataFrm->meeting_code;
$faculty_code = $dataFrm->faculty_code;
$agency_name = $dataFrm->agency_name;
$action = $dataFrm->action;

// $sql = "INSERT INTO mt_agency SET
//     meeting_code = '$meeting_code',
//     faculty_code = '$faculty_code',
//     agency_name = '$agency_name'
//     ";
$rows = array();
$obj = new stdClass();

if ($action == 'Insert') {

    $i = 0;

    $sqlIns = "INSERT INTO mt_agency (agency_code, meeting_code, faculty_code, agency_name)
    VALUES (null, '$meeting_code', '$faculty_code', '$agency_name')";
    
    if ($conn->query($sqlIns)) {
        $i++;
        // Add $rows_regis to array
        $obj->status = 'Ok';
        $obj->resp = $sqlIns;
        $obj->num_query = $i;
        $rows = $obj;
    } else {
        $obj->status = 'No';
        $obj->resp = $sql;
        $rows = $obj;
    }
} else {
    $obj->status = 'Not permission';
    $rows = $obj;
}




header("Access-Control-Allow-Origin: *");
header("content-type:text/javascript;charset=utf-8");
header("Content-Type: application/json; charset=utf-8", true, 200);

print json_encode($rows);

$conn->close();
