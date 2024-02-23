<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";

// รับค่า std_id จากคำขอ
$open_code = $_GET['open_code']; 

// สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
$sql = "SELECT * FROM  mt_meeting_topic mtt 
LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
WHERE mtt.open_code = '$open_code' ORDER BY mttopic_code ASC";


// ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
$result = $conn->query($sql);
$numrow = $result->num_rows;
// ตรวจสอบผลลัพธ์
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        //ตารางเสนอวาระ
        $sqlAgendaTopic = "SELECT * FROM mt_agendatopic WHERE meeting_code = '$row[meeting_code]' AND topic_code = '$row[topic_code]'";
        // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
        $resultAgendaTopic = $conn->query($sqlAgendaTopic);
        $numrow_topic = $resultAgendaTopic->num_rows;
        $row['num_topic'] = $numrow_topic;
        $data[] = $row;
    }
    // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
    header('Content-Type: application/json');
    echo json_encode(array('data' => $data, 'row' => $numrow, 'res'=>$sqlAgendaTopic));
} else {
    $data = array();
    // ถ้าไม่พบข้อมูลนักศึกษา
    echo json_encode(array('data' => $data, 'resp' => $sql));
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
