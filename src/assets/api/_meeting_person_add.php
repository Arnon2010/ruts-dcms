<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$meeting_code = $dataFrm->meeting_code;
$mtposition_code = $dataFrm->mtposition_code;
$citizen_id = $dataFrm->citizen_id;
$person_name = $dataFrm->person_name;

$person_instead = $dataFrm->person_instead;
$person_note = $dataFrm->person_note;
$person_type = $dataFrm->person_type;
$action = $dataFrm->action;

//date add & modified.
$date = date('Y-m-d H:i:s');

if($person_type == '2') {
    $outsider_code = $citizen_id;
    $citizen_id = '0';
} else {
    $outsider_code = '0';
}

$rows = array();
$obj = new stdClass();

if ($action == 'Insert') {
    $i = 0;
    $sql = "INSERT INTO mt_person SET
    meeting_code = '$meeting_code',
    mtposition_code = '$mtposition_code',
    citizen_id = '$citizen_id',
    person_name = '$person_name',
    outsider_code = '$outsider_code',
    person_instead = '$person_instead',
    person_note = '$person_note',
    person_type = '$person_type',
    person_dateadd = '$date',
    person_datemod = '$date'
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
