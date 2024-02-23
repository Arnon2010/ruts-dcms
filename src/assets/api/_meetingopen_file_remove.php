<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$action = $dataFrm->action;
$open_code = $dataFrm->open_code;
$path = $dataFrm->path;

$folder_path = "../documents";
$file_path = $folder_path.$path;

$rows = array();
$obj = new stdClass();

if($action == 'Delete'){
    // Remove topic of meeting
    $sql = "UPDATE mt_meeting_open SET open_path = ''  
    WHERE open_code = '$open_code'";
    if ($conn->query($sql)) {
        // remove file
       
        if (file_exists($file_path)) {
            // Attempt to remove the file
            if (unlink($file_path)) {
                $mesg = "File $file_path has been successfully deleted.";
            } else {
                $mesg = "Error: Unable to delete $file_path.";
            }
        } else {
            $mesg = "Error: File $file_path does not exist.";
        }
        
        $obj->status = 'Ok';
        $obj->mesg = $mesg;
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
