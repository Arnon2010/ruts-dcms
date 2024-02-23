<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

// รับค่า sจากคำขอ
$user_id = $dataFrm->user_id;
$meeting_code = $dataFrm->meeting_code;
$action = $dataFrm->action;

//date add & modified.
$date_create = date('Y-m-d H:i:s');
$date_modified = date('Y-m-d H:i:s');

if ($action == 'Copy') {
    $sql = "SELECT * FROM  mt_meeting
        WHERE meeting_astatus = '1' 
        AND meeting_code = '$meeting_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $row = $result->fetch_assoc();

    $meeting_thetime = $row['meeting_thetime'].' copy';

    // copy
    $sqlCopy = "INSERT INTO mt_meeting SET 
        open_code = '$row[open_code]',
        propose_code = '$row[propose_code]',
        channel_code =  '$row[channel_code]',
        program_code = '$row[program_code]',
        meeting_link = '$row[meeting_link]',
        meeting_id = '$row[meeting_id]',  
        meeting_passcode = '$row[meeting_passcode]',
        meeting_location = '$row[meeting_location]',
        meeting_thetime = '$meeting_thetime',
        meeting_sdate = '$row[meeting_sdate]',
        meeting_edate = '$row[meeting_edate]',
        meeting_time = '$row[meeting_time]',
        meeting_fdate = '$row[meeting_fdate]',
        meeting_doc = '$row[meeting_doc]',
        user_id = '$user_id',
        date_create = '$date_create',
        date_modified = '$date_modified'
        ";

    $rows = array();
    $obj = new stdClass();

    if ($conn->query($sqlCopy)) {
        $meeting_code_last = $conn->insert_id;

        // กรรมการพิจารณาวาระ
        $sqlc = "SELECT * FROM  mt_consider c 
        LEFT JOIN mt_position p ON c.position_code = p.position_code
        WHERE meeting_code = '$meeting_code'";

        // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
        $resultc = $conn->query($sqlc);
        // ตรวจสอบผลลัพธ์
        if ($resultc->num_rows > 0) {
            while ($rowc = $resultc->fetch_assoc()) {

                // copy consider
                $sqlInsC = "INSERT INTO mt_consider SET
                    meeting_code = '$meeting_code_last',
                    position_code = '$rowc[position_code]',
                    citizen_id = '$rowc[citizen_id]',
                    person_name = '$rowc[person_name]'
                    ";

                    $conn->query($sqlInsC);
            }
        }

        // หน่วยงานเข้าร่วม
        $sqla = "SELECT * FROM  mt_agency
            WHERE meeting_code = '$meeting_code'";
        $resulta = $conn->query($sqla);
        // ตรวจสอบผลลัพธ์
        if ($resulta->num_rows > 0) {
            while ($rowa = $resulta->fetch_assoc()) {
                // copy agency
                $sqlInsA = "INSERT INTO mt_agency (agency_code, meeting_code, faculty_code, agency_name)
                    VALUES (null, '$meeting_code_last', '$rowa[faculty_code]', '$rowa[agency_name]')";
                $conn->query($sqlInsA);
            }
        }

        $obj->status = 'Ok';
        $obj->resp = $sql;
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


// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
