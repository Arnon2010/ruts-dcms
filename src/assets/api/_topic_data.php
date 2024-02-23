<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";

// รับค่า std_id จากคำขอ
$open_code = $_GET['open_code'];

// สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
// $sql = "SELECT * FROM  mt_topic 
// WHERE topic_astatus = '1' AND not in (SELECT topic_code FROM mt_meetingtopic)";

$sql = "SELECT topic_code, topic_name
FROM mt_topic
WHERE topic_code NOT
IN (
SELECT topic_code
FROM mt_meeting_topic
WHERE open_code = '$open_code'
) AND topic_astatus = '1' ORDER BY topic_code ASC";

// ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
$result = $conn->query($sql);
$numrow = $result->num_rows;
// ตรวจสอบผลลัพธ์
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // $data[] = array(
        //     'user_id' => $row['user_id'],
        //     'user_email' => $row['user_email'],
        // );

        $data[] = $row;
    }
    // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
    header('Content-Type: application/json');
    echo json_encode(array('data' => $data, 'row' => $numrow));
} else {
    // ถ้าไม่พบข้อมูลนักศึกษา
    echo json_encode(array('data' => $data, 'resp' => $sql));
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
