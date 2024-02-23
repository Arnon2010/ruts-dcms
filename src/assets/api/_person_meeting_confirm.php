<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$opt = $dataFrm->opt;
$meeting_code = $dataFrm->meeting_code;
$confirm_status = $dataFrm->confirm_status;
$citizen_id = $dataFrm->cid;
$person_type = $dataFrm->person_type; //ภายใน ภายนอก
$outsider_code = $dataFrm->outsider_code; //รหัสบุคคลภายนอก
//date add & modified.
$date = date('Y-m-d H:i:s');

$rows = array();
$obj = new stdClass();

if ($opt == 'ConfirmMeeting') {
    
    if($person_type == '1') {
        $sql = "UPDATE mt_person SET
        person_rstatus = '$confirm_status', person_datemod = '$date'
        WHERE meeting_code = '$meeting_code'
        AND citizen_id = '$citizen_id'";
    
    } else {
        $sql = "UPDATE mt_person SET
        person_rstatus = '$confirm_status' , person_datemod = '$date'
        WHERE meeting_code = '$meeting_code'
        AND outsider_code = '$outsider_code'";
    
    }
   
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
