<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$meeting_code = $dataFrm->meeting_code;
$meeting_endtime = $dataFrm->meeting_endtime;
$action = $dataFrm->action;

$report_date = date('Y-m-d H:i:s');

$rows = array();
$obj = new stdClass();



if ($action == 'endMeeting') {

    $sql = "SELECT * FROM  mt_report 
    WHERE meeting_code = '$meeting_code'";
    
    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        $sql = "UPDATE mt_report SET
        report_etime = '$meeting_endtime',
        report_detail = '',
        report_date = '$report_date' 
        WHERE  meeting_code = '$meeting_code'
        ";
    } else {
        $sql = "INSERT INTO mt_report SET
        meeting_code = '$meeting_code',
        report_etime = '$meeting_endtime',
        report_detail = '',
        report_date = '$report_date'
        ";
    }
   

    if ($conn->query($sql)) {

        // ปิดประชุม meeting 
        $sql_close = "UPDATE mt_meeting SET meeting_rstatus = '3'
        WHERE  meeting_code = '$meeting_code'
        ";
        $conn->query($sql_close);

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
