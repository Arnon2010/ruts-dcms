<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";
$content = file_get_contents('php://input');
$request = json_decode($content);
$opt = $request->opt;

/** รายการอยู่ระหว่างการประชุม */
if ($opt == 'viewMeetingSave') {

    $faculty_code = $request->faculty_code;

    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_meeting mt
    LEFT JOIN mt_meeting_open mto ON mt.open_code = mto.open_code
    LEFT JOIN mt_program p ON mt.program_code = p.program_code
    WHERE mt.meeting_astatus = '1' 
    AND mt.meeting_rstatus IN ('1','2','3')  
    AND mto.faculty_code = '$faculty_code' 
    ORDER BY mt.meeting_sdate ASC";

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
        echo json_encode(array('data' => $data, 'row' => $numrow));
    } else {
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('row' => $numrow));
    }
}

/**  */
if ($opt == 'veiw...') {
    // รับค่าจากคำขอ
    $meeting_code = $request->meeting_code;
    $open_code = $request->open_code;
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
