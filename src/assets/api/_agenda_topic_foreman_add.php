<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$agendatopic_code = $dataFrm->agendatopic_code;
$citizen_id = $dataFrm->citizen_id;
$position_work = $dataFrm->position_work;
$foreman_name = $dataFrm->foreman_name;
$action = $dataFrm->action;

$rows = array();
$obj = new stdClass();

if ($action == 'Insert') {
    $i = 0;
    $sql = "INSERT INTO mt_foreman SET
    agendatopic_code = '$agendatopic_code',
    citizen_id = '$citizen_id',
    position_work = '$position_work',
    foreman_name = '$foreman_name'
    ";

    if ($conn->query($sql)) {
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
