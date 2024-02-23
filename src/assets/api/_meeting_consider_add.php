<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$meeting_code = $dataFrm->meeting_code;
$position_code = $dataFrm->position_code;
$citizen_id = $dataFrm->citizen_id;
$person_name = $dataFrm->person_name;
$action = $dataFrm->action;


$rows = array();
$obj = new stdClass();

if ($action == 'Insert') {
    $i = 0;
    $sqlIns = "INSERT INTO mt_consider SET
    meeting_code = '$meeting_code',
    position_code = '$position_code',
    citizen_id = '$citizen_id',
    person_name = '$person_name'
    ";

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
