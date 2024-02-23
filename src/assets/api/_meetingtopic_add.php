<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$open_code = $dataFrm->open_code;
$topic_code = $dataFrm->topic_code;
$opt = $dataFrm->opt;


// $open_code = $dataFrm->open_code;
// $topic_done = $dataFrm->topic_done;
$rows = array();

// // Remove topic of meeting
// $sqlDel = "DELETE FROM mt_meeting_topic WHERE open_code = '$open_code'";
// $conn->query($sqlDel);

// // Add topic to table
// foreach($topic_done as $val) {
//     $sql = "INSERT INTO mt_meeting_topic SET
//     open_code = '$open_code',
//     topic_code = '$val->topic_code'";
//     $obj = new stdClass();
//     if ($conn->query($sql)) {
//         // Add $rows_regis to array
//         $obj->status = 'Ok';
//         $rows = $obj;
//     } else {
//         $obj->status = 'No';
//         $obj->resp = $sql;
//         $rows = $obj;
//     }
// }

if($opt == 'Insert') {
    $sql = "INSERT INTO mt_meeting_topic SET
    open_code = '$open_code',
    topic_code = '$topic_code'";
    $obj = new stdClass();
    if ($conn->query($sql)) {
        // Add $rows_regis to array
        $obj->status = 'Ok';
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
