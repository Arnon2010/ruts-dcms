<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$agendatopic_code = $dataFrm->agendatopic_code;
$agendatopic_note = $dataFrm->agendatopic_note;
$action_submit = $dataFrm->action_submit;

if($action_submit == 'Update') { //เพิ่ม
    $sql = "UPDATE mt_agendatopic SET
    agendatopic_note = '$agendatopic_note'   
    WHERE agendatopic_code = '$agendatopic_code'";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
    $obj->status = 'Ok';
    $obj->resp = '';
    $rows = $obj;

} else {
    $obj->status = 'No';
    $obj->resp = $sql;
    $rows = $obj;
}

header("Access-Control-Allow-Origin: *");
header("content-type:text/javascript;charset=utf-8");
header("Content-Type: application/json; charset=utf-8", true, 200);

print json_encode($rows);

$conn->close();
