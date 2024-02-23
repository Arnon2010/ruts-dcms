<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$action = $dataFrm->action;
$meeting_code = $dataFrm->meeting_code;

$rows = array();
$obj = new stdClass();
if($action == 'save'){
    // Remove topic of meeting
    $sql = "UPDATE mt_meeting SET meeting_rstatus = 'C'  WHERE meeting_code = '$meeting_code'";
    if ($conn->query($sql)) {
        // Add $rows_regis to array
        $obj->status = 'Ok';
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
