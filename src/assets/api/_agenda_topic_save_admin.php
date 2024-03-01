<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$meeting_code = $_POST['meeting_code'];
$user_id = $_POST['user_id'];
$faculty_code = $_POST['faculty_code'];
$topic_code = $_POST['topic_code'];
$agendatopic_origin = $_POST['agendatopic_origin'];
$agendatopic_offer = $_POST['agendatopic_offer'];
$agendatopic_prarent = $_POST['agendatopic_prarent'];
$agendatopic_no = $_POST['agendatopic_no'];
$agendatopic_name = $_POST['agendatopic_name'];

$action_submit = $_POST['action_submit'];
$agendatopic_code = $_POST['agendatopic_code'];
$faculty_code = $_POST['faculty_code'];
$agendatopic_doc = $_POST['agendatopic_doc'];

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
    $fileurl = '_meeting-filesubtitle-'.$faculty_code . "-" . date("YmdHis") . "." . $ext;
    $path_file = '/'.$year.'/'.$faculty_code. '/'.$fileurl;
    move_uploaded_file($_FILES["file_doc"]["tmp_name"][$i], $path . $fileurl);
}
} else {
    $path_file = $agendatopic_doc;
}

if($action_submit == 'Insert') { //เพิ่ม

    $sql = "INSERT INTO mt_agendatopic SET
    meeting_code = '$meeting_code',
    faculty_code =  '$faculty_code',
    topic_code = '$topic_code',
    agendatopic_prarent = '$agendatopic_prarent',
    agendatopic_no = '$agendatopic_no',
    agendatopic_name = '$agendatopic_name',
    agendatopic_origin = '$agendatopic_origin',
    agendatopic_offer = '$agendatopic_offer',  
    agendatopic_doc = '$path_file', 
    agendatopic_rstatus = 'Y',
    user_id = '$user_id',
    agendatopic_date = '$date_create'
    ";
} else { // แก้ไข
    $sql = "UPDATE mt_agendatopic SET
    meeting_code = '$meeting_code',
    faculty_code =  '$faculty_code',
    topic_code = '$topic_code',
    agendatopic_no = '$agendatopic_no',
    agendatopic_name = '$agendatopic_name',
    agendatopic_origin = '$agendatopic_origin',
    agendatopic_offer = '$agendatopic_offer',
    agendatopic_doc = '$path_file',   
    agendatopic_rstatus = 'Y',
    user_id = '$user_id',
    agendatopic_date = '$date_create'
    WHERE agendatopic_code = '$agendatopic_code'";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
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
