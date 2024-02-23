<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);
$opt = $dataFrm->opt;
$mttopic_code = $dataFrm->mttopic_code;

// $open_code = $dataFrm->open_code;
// $topic_done = $dataFrm->topic_done;
$rows = array();
$obj = new stdClass();

if($opt == 'Delete') {
    $sql = "DELETE FROM mt_meeting_topic WHERE mttopic_code = '$mttopic_code'";
    
    if ($conn->query($sql)) {
        // Add $rows_regis to array
        $obj->status = 'Ok';
        $obj->resp = $sql;
        $rows = $obj;
    } else {
        $obj->status = 'No';
        $obj->resp = $sql;
        $rows = $obj;
    }
} 

header("Access-Control-Allow-Origin: *");
header("content-type:text/javascript;charset=utf-8");
header("Content-Type: application/json; charset=utf-8", true, 200);

print json_encode($rows);

$conn->close();
