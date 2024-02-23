<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$opt = $dataFrm->opt;
$agendatopic_code = $dataFrm->agendatopic_code;
$agendatopic_name = $dataFrm->agendatopic_name;
$agendatopic_no = $dataFrm->agendatopic_no;
$agendatopic_origin = $dataFrm->agendatopic_origin;
$agendatopic_offer = $dataFrm->agendatopic_offer;
$confirm_status = $dataFrm->confirm_status;

$rows = array();
$obj = new stdClass();
if($opt == 'confirmAgendaTopic'){
    // Remove topic of meeting
    $sql = "UPDATE  mt_agendatopic  SET agendatopic_rstatus = '$confirm_status', 
    agendatopic_no = '$agendatopic_no',
    agendatopic_name = '$agendatopic_name',
    agendatopic_origin = '$agendatopic_origin',
    agendatopic_offer = '$agendatopic_offer' WHERE agendatopic_code = '$agendatopic_code'";
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
