<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";

// รับค่า std_id จากคำขอ
$faculty_code = $_GET['faculty_code']; // หรือใช้ $_POST แล้วเปลี่ยนเป็น POST ในคำสั่ง SQL

// สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
$sql = "SELECT ac.agency_code, ac.agency_name, mo.open_code, mo.open_title, u.faculty_name, m.* 
FROM  mt_agency ac 
LEFT JOIN mt_meeting m ON ac.meeting_code = m.meeting_code
LEFT JOIN mt_meeting_open mo ON m.open_code = mo.open_code
LEFT JOIN mt_user u ON ac.faculty_code = u.faculty_code
WHERE agency_astatus = '1' 
AND ac.faculty_code = '$faculty_code'
GROUP BY m.open_code
";

// ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
$result = $conn->query($sql);
$numrow = $result->num_rows;
// ตรวจสอบผลลัพธ์
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
    header('Content-Type: application/json');
    echo json_encode(array('data' => $data, 'row' => $numrow, 'resp' => $sql));
} else {
    // ถ้าไม่พบข้อมูลนักศึกษา
    $data[] = array(
        'resp'=>$sql
    );
    echo json_encode(array('data' => $data));
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
