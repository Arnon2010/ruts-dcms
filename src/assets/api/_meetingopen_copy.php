<?php
date_default_timezone_set('Asia/Bangkok');
include_once "db.php";

$content = file_get_contents('php://input');
$dataFrm = json_decode($content);

// รับค่า sจากคำขอ
$user_id = $dataFrm->user_id;
$open_code = $dataFrm->open_code;
$action = $dataFrm->action;

//date add & modified.
$date_create = date('Y-m-d H:i:s');
$date_modified = date('Y-m-d H:i:s');

if ($action == 'Copy') {
    $sql = "SELECT * FROM  mt_meeting_open
        WHERE open_astatus = '1' 
        AND open_code = '$open_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $row = $result->fetch_assoc();

    $open_title = $row['open_title'].' copy';

    // copy
    $sqlCopy = "INSERT INTO mt_meeting_open SET
        type_code = '$row[type_code]',
        open_title =  '$open_title',
        open_order = '$row[open_order]',
        open_path = '$row[open_path]',
        open_year = '$row[open_year]',  
        faculty_code = '$row[faculty_code]',
        user_id = '$user_id',
        date_create = '$date_create',
        date_modified = '$date_modified'
        ";

    $rows = array();
    $obj = new stdClass();

    if ($conn->query($sqlCopy)) {
        $open_code_last = $conn->insert_id;

        // ตำแหน่งในการประชุม
        $sqlp = "SELECT * FROM mt_meeting_position
        WHERE open_code = '$open_code'";
        $resultp = $conn->query($sqlp);
        if ($resultp->num_rows > 0) {
            while ($rowp = $resultp->fetch_assoc()) {

                // copy consider
                $sqlInsC = "INSERT INTO mt_meeting_position SET
                    mtposition_name = '$rowp[mtposition_name]',
                    open_code = '$open_code_last'
                    ";

                    $conn->query($sqlInsC);
            }
        }

        // หัวข้อวาระการประชุม
        $sqla = "SELECT * FROM  mt_meeting_topic mtt 
        LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
        WHERE mtt.open_code = '$open_code' ORDER BY mttopic_code ASC";
        $resulta = $conn->query($sqla);
        // ตรวจสอบผลลัพธ์
        if ($resulta->num_rows > 0) {
            while ($rowa = $resulta->fetch_assoc()) {
                // copy agency
                $sqlInsA = "INSERT INTO mt_meeting_topic SET
                open_code = '$open_code_last',
                topic_code = '$rowa[topic_code]'";
                $conn->query($sqlInsA);
            }
        }

        // ผู้ร่วมประชุม
        $sql_person = "SELECT * FROM  mt_person p
        LEFT JOIN mt_meeting_position mp ON p.mtposition_code = mp.mtposition_code
        WHERE p.open_code = '$open_code'";
        $result_person = $conn->query($sql_person);
        // ตรวจสอบผลลัพธ์
        if ($result_person->num_rows > 0) {
            while ($row_person = $result_person->fetch_assoc()) {
                // copy agency
                $sqlInsPerson = "INSERT INTO mt_person SET
                open_code = '$open_code_last',
                mtposition_code = '$row_person[mtposition_code]',
                citizen_id = '$row_person[citizen_id]',
                person_name = '$row_person[person_name]',
                outsider_code = '$row_person[outsider_code]',
                person_instead = '$row_person[person_instead]',
                person_note = '$row_person[person_note]',
                person_rstatus = '$row_person[person_rstatus]'";
                $conn->query($sqlInsPerson);
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
