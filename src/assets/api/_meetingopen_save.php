<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

// $faculty_code = $dataFrm->faculty_code;
// $user_id = $dataFrm->user_id;
// $type_code = $dataFrm->type_code;
// $propose_code = $dataFrm->propose_code;
// $open_title = $dataFrm->open_title;
// $open_order = $dataFrm->open_order;
// $open_path = $dataFrm->open_path;
// $open_code = $dataFrm->open_code;

// $action_submit = $dataFrm->action_submit;

$faculty_code = $_POST['faculty_code'];
$user_id = $_POST['user_id'];
$type_code = $_POST['type_code'];
$open_title = $_POST['open_title'];
$open_year = $_POST['open_year'];
$open_order = $_POST['open_order'];
$open_code = $_POST['open_code'];

$action_submit = $_POST['action_submit'];

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

$files = $_FILES['open_path']['name'];

for ($i = 0; $i < count($files); $i++) {
    $filename = $files[$i];
    $tmp = explode('.', $filename);
    $ext = end($tmp);
    $original = pathinfo($filename, PATHINFO_FILENAME);
    $fileurl = 'OPEN-'.$faculty_code . "-" . date("YmdHis") . "." . $ext;
    $path_file = '/'.$year.'/'.$faculty_code.'/'.$fileurl;
    move_uploaded_file($_FILES["open_path"]["tmp_name"][$i], $path . $fileurl);
}


if($action_submit == 'Insert') { //เพิ่ม

    $sql = "INSERT INTO mt_meeting_open SET
    type_code = '$type_code',
    open_title =  '$open_title',
    open_order = '$open_order',
    open_path = '$path_file',
    open_year = '$open_year',  
    faculty_code = '$faculty_code',
    user_id = '$user_id',
    date_create = '$date_create',
    date_modified = '$date_modified'
    ";
} else { // แก้ไข
    $sql = "UPDATE mt_meeting_open SET
    type_code = '$type_code',
    open_title =  '$open_title',
    open_order = '$open_order',
    open_path = '$path_file',
    open_year = '$open_year',  
    user_id = '$user_id',
    date_modified = '$date_modified'
    WHERE open_code = '$open_code' ";
}

$rows = array();
$obj = new stdClass();
if ($conn->query($sql)) {
    // Add $rows_regis to array
    if($action_submit == 'Insert') {
        $last_id = $conn->insert_id;
        $obj->open_code = $last_id;
    } else {
        $obj->open_code = $open_code;
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
