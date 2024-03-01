<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$opt = $dataFrm->opt;
$agendatopic_code = $dataFrm->agendatopic_code;

$folder_path = "../documents";
$file_path = $folder_path.'/'.$agendatopic_doc;

// if (!file_exists($file_path)) {
//     mkdir($path, 0777, true);
// }

$rows = array();
$obj = new stdClass();

//
if($opt == 'DelAgendaTopic'){
    // Remove topic of meeting
    $sql = "UPDATE  mt_agendatopic set agendatopic_astatus = '0'  
    WHERE agendatopic_code = '$agendatopic_code'";
    if ($conn->query($sql)) {
        //Delete file

        // Check if the file exists before attempting to remove it
        // if (file_exists($file_path)) {
        //     // Attempt to remove the file
        //     if (unlink($file_path)) {
        //         $mesg = "File $file_path has been successfully deleted.";
        //     } else {
        //         $mesg = "Error: Unable to delete $file_path.";
        //     }
        // } else {
        //     $mesg = "Error: File $file_path does not exist.";
        // }
        
        // Add $rows_regis to array
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
