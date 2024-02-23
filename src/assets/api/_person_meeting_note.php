<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$opt = $dataFrm->opt;
$agendatopic_code = $dataFrm->agendatopic_code;

//date add & modified.
$date = date('Y-m-d H:i:s');

$rows = array();
$obj = new stdClass();

if ($opt == 'saveNoteTopic') {
    

    $sql = "UPDATE mt_person SET
        person_rstatus = '$confirm_status' , person_datemod = '$date'
    WHERE meeting_code = '$meeting_code'
    AND outsider_code = '$outsider_code'";
    
    if ($conn->query($sql)) {
        $obj->status = 'Ok';
        $obj->resp = $sql;
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
