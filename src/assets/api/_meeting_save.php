<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

// $content = file_get_contents('php://input');
// $dataFrm = json_decode($content);
$user_id = $_POST['user_id'];
$faculty_code = $_POST['faculty_code'];
$meeting_code = $_POST['meeting_code'];

$action_submit = $_POST['action_submit'];
$open_code = $_POST['open_code'];
$propose_code = $_POST['propose_code']; //ประเภทเสนอวาระ
$channel_code = $_POST['channel_code'];
$program_code = $_POST['program_code'];
$meeting_link = $_POST['meeting_link'] != 'undefined' ? $_POST['meeting_link']: '';
$meeting_id = $_POST['meeting_id'] != 'undefined' ? $_POST['meeting_id']: '';
$meeting_passcode = $_POST['meeting_passcode'] != 'undefined' ? $_POST['meeting_passcode']: '';
$meeting_location = $_POST['meeting_location'] != 'undefined' ? $_POST['meeting_location']: '';

$meeting_thetime = $_POST['meeting_thetime'];//คร้ังที่
$meeting_sdate = $_POST['meeting_sdate'];//วันที่เริ่มประชุม
$meeting_edate = $_POST['meeting_edate'];//วันที่สินสุดการประชุม
$meeting_time = $_POST['meeting_time'];//เวลาเริ่มประชุม
$meeting_fdate = $_POST['propose_code'] == '01' ? $_POST['meeting_fdate']: ''; //วันที่สิ้นสุดเสนอวาระ

//date add & modified.
$date_create = date('Y-m-d H:i:s');
$date_modified = date('Y-m-d H:i:s');

$year = date('Y') + 543;
$uploadFolder = "../documents/".$year;

// Create folder
$path = $uploadFolder.'/'.$faculty_code.'/';
if (!file_exists($path)) {
    mkdir($path, 0777, true);
}

$files = $_FILES['file_doc']['name'];
if(count($files) >= 1) {
    for ($i = 0; $i < count($files); $i++) {
        $filename = $files[$i];
        $tmp = explode('.', $filename);
        $ext = end($tmp);
        $original = pathinfo($filename, PATHINFO_FILENAME);
        $fileurl = 'MEETING-'.$faculty_code . "-" . date("YmdHis") . "." . $ext;
        $path_file = '/'.$year.'/'.$faculty_code.'/'.$fileurl;
        move_uploaded_file($_FILES["file_doc"]["tmp_name"][$i], $path . $fileurl);
    }
    
} else {
    $path_file = $_POST['meeting_doc'];
}

if($action_submit == 'Insert') { //เพิ่ม
    $sql = "INSERT INTO mt_meeting SET 
    open_code = '$open_code',
    propose_code = '$propose_code',
    channel_code =  '$channel_code',
    program_code = '$program_code',
    meeting_link = '$meeting_link',
    meeting_id = '$meeting_id',  
    meeting_passcode = '$meeting_passcode',
    meeting_location = '$meeting_location',
    meeting_thetime = '$meeting_thetime',
    meeting_sdate = '$meeting_sdate',
    meeting_edate = '$meeting_edate',
    meeting_time = '$meeting_time',
    meeting_fdate = '$meeting_fdate',
    meeting_doc = '$path_file',
    user_id = '$user_id',
    date_create = '$date_create',
    date_modified = '$date_modified'
    ";
} else { // แก้ไข
    $sql = "UPDATE mt_meeting SET
    propose_code = '$propose_code',
    channel_code =  '$channel_code',
    program_code = '$program_code',
    meeting_link = '$meeting_link',
    meeting_id = '$meeting_id',
    meeting_passcode = '$meeting_passcode',
    meeting_location = '$meeting_location',
    meeting_thetime = '$meeting_thetime',
    meeting_sdate = '$meeting_sdate',
    meeting_edate = '$meeting_edate',
    meeting_time = '$meeting_time',
    meeting_fdate = '$meeting_fdate',
    meeting_doc = '$path_file',
    user_id = '$user_id',
    date_modified = '$date_modified'
    WHERE meeting_code = '$meeting_code' ";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
    // Add $rows_regis to array
    if($action_submit == 'Insert') {
        $last_id = $conn->insert_id;
        $obj->meeting_code = $last_id;
    } else {
        $obj->meeting_code = $meeting_code;
    }
    $obj->status = 'Ok';
    $obj->resp = $sql;
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
