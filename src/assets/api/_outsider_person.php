<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";

// รับค่า std_id จากคำขอ

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

$opt = $dataFrm->opt;
$search = $dataFrm->search;


if($opt == 'viewNAME') {
    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT outsider_code, prefix_name, outsider_fname, outsider_lname, outsider_phone
    FROM  mt_outsider WHERE outsider_astatus = '1' 
    AND (outsider_fname LIKE '%$search%' OR outsider_lname LIKE '%$search%')";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;

    $data = array();
    // ตรวจสอบผลลัพธ์
    //if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = array(
            'id' => $row['outsider_code'],
            'name' => $row['prefix_name'].''.$row['outsider_fname'].' '.$row['outsider_lname'],
            'TELEPHONE' => $row['outsider_phone'],
            );
        }
        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $data));
    // } else {
    //     // ถ้าไม่พบข้อมูลนักศึกษา
    //     echo json_encode(array('row' => '0'));
    // }
}


// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
