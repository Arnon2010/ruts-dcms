<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // ตรวจสอบเมื่อมีการส่งคำขอตัวอย่างสำหรับตรวจสอบ CORS
    // ตอบกลับเฉพาะ header และส่งออกจากไฟล์นี้เท่านั้น
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = file_get_contents('php://input');
    $dataFrm = json_decode($content, true);

    $user_epassport = $dataFrm['user_epassport'];
    $user_password = 'Auth';

    // check permission.

    $sql = "SELECT * FROM mt_user 
    WHERE user_epassport = '$user_epassport' 
    AND user_password = '$user_password'";

    if ($result = $conn->query($sql)) {
        if ($result->num_rows > 0) {
          $row = $result->fetch_assoc();
            echo json_encode(array('row'=>$row, 'status'=>'ok'));
        } else {
            echo json_encode('Login failed');
        }
        //$result->close();
    } else {
        echo json_encode('Error querying the database');
    }

    $conn->close();
}
?>
