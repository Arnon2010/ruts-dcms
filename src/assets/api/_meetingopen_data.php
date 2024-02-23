<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";

// รับค่า std_id จากคำขอ
$faculty_code = $_GET['faculty_code']; // หรือใช้ $_POST แล้วเปลี่ยนเป็น POST ในคำสั่ง SQL

// สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
$sql = "SELECT *
FROM  mt_meeting_open
WHERE open_astatus = '1' AND faculty_code = '$faculty_code'";


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
    echo json_encode(array('row' => $numrow));
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
