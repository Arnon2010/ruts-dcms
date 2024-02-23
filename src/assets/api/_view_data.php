<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once "db.php";
$content = file_get_contents('php://input');
$request = json_decode($content);
$opt = $request->opt;

/** ข้อมูลการเสนอวาระจากหน่วยงานเข้าร่วม */
if ($opt == 'viewMeetingData') {

    //$topic_code = $request->topic_code;
    $meeting_code = $request->meeting_code;

    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_meeting mt 
    LEFT JOIN mt_meeting_open mto ON mt.open_code = mto.open_code
    WHERE mt.meeting_code = '$meeting_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $No = 0;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $row, 'row' => $numrow));
    } else {
        $data = array();
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('data' => $data, 'resp' => ''));
    }
}

/** วาระที่เสนอจากหน่วยงานเข้าร่วม */
else if ($opt == 'viewAgendaTopic') {

    //$topic_code = $request->topic_code;
    $meeting_code = $request->meeting_code;
    $faculty_code = $request->faculty_code;
    $open_code = $request->open_code;

    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_meeting_topic mtt
    LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
    WHERE mtt.open_code = '$open_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $No = 0;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $No++;
            $topic_code = $row['topic_code'];
            // วาระย่อย 1
            $sqlTopicSub = "SELECT * FROM  mt_agendatopic agt 
            WHERE agt.faculty_code = '$faculty_code' 
            AND agt.topic_code = '$topic_code'
            AND agt.meeting_code = '$meeting_code' 
            AND agt.agendatopic_prarent = '0'
            ORDER BY agt.agendatopic_code ASC";

            // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
            $result_sub = $conn->query($sqlTopicSub);
            //$numrow2 = $result_sub->num_rows;

            //if ($result_sub->num_rows > 0) {
            $i = 0;
            $data_sub = [];
            while ($row_sub = $result_sub->fetch_assoc()) {

                $i++;
                $row_sub['topic_no'] = $No . '.' . $i; // เพิ่มค่า $i เข้าไปใน $row_sub
                //$rows[count($rows) - 1]['sub_data'][$k-1] = $row_sub; // เก็บข้อมูลใน sub_data ของ row ล่าสุด

                // ผู้ชี้แจงข้อสักถาม
                $sqlForeman = "SELECT * FROM  mt_foreman 
                WHERE agendatopic_code = '$row_sub[agendatopic_code]'";
                $resultForeman = $conn->query($sqlForeman);
                $num_foreman = $resultForeman->num_rows;
                $data_foreman = [];
                // ตรวจสอบผลลัพธ์
                while ($row_foreman = $resultForeman->fetch_assoc()) {
                    
                    $data_foreman[] = $row_foreman;
                }
                // วาระย่อย 2
                $sqlTopicSub2 = "SELECT * FROM  mt_agendatopic agt 
                        WHERE agt.agendatopic_prarent = '$row_sub[agendatopic_code]' 
                        ORDER BY agt.agendatopic_code ASC";

                // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
                $result_sub2 = $conn->query($sqlTopicSub2);
                //$numrow = $result_topic_sub->num_rows;
                $data_sub2 = [];
                $k = 0;
                while ($row_sub2 = $result_sub2->fetch_assoc()) {
                    $k++;

                    // ผู้ชี้แจงข้อสักถาม
                    $sqlForeman2 = "SELECT * FROM  mt_foreman 
                    WHERE agendatopic_code = '$row_sub2[agendatopic_code]'";
                    $resultForeman2 = $conn->query($sqlForeman2);
                    $num_foreman2 = $resultForeman2->num_rows;
                    $data_foreman2 = [];
                    // ตรวจสอบผลลัพธ์
                    while ($row_foreman2 = $resultForeman2->fetch_assoc()) {
                        
                        $data_foreman2[] = $row_foreman2;
                    }


                    $row_sub2['num_foreman'] = $num_foreman2; //จำนวนผู้ชี้แจง
                    $row_sub2['topic_no2'] = $No . '.' . $i . '.' . $k; // เพิ่มค่า $i เข้าไปใน $row_sub 
                    $data_sub2[] = $row_sub2;
                }
                $row_sub['num_foreman'] = $num_foreman; //จำนวนผู้ชี้แจง
                $row_sub['data_sub2'] = $data_sub2; // เก็บข้อมูลใน data_sub2 ของ row_sub ล่าสุด
                $row_sub['data_foreman'] = $data_foreman; // เก็บข้อมูลใน ผู้ชี้แจงข้อสักถาม

                $data_sub[] = $row_sub;
            }
            //}

            $rows[] = array(
                'No' => $No,
                'open_code' => $row['open_code'],
                'topic_code' => $row['topic_code'],
                'topic_name' => $row['topic_name'],
                'agendatopic_code' => '0',
                'sub_data' => $data_sub
            );
        }
        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $rows, 'row' => $numrow));
    } else {
        $data = array();
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('data' => $data, 'resp' => $sqlTopicSub));
    }
}

/**  */
else if ($opt == 'veiwAgendaManage') {
    // รับค่าจากคำขอ
    $meeting_code = $request->meeting_code;
    $open_code = $request->open_code;

    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_meeting_topic mtt
    LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
    WHERE mtt.open_code = '$open_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $No = 0;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $No++;
            $topic_code = $row['topic_code'];
            // วาระย่อย 1
            $sqlTopicSub = "SELECT * FROM  mt_agendatopic agt 
            WHERE agt.topic_code = '$row[topic_code]'
            AND agt.meeting_code = '$meeting_code' 
            AND agt.agendatopic_prarent = '0'
            ORDER BY agt.agendatopic_no ASC";

            // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
            $result_sub = $conn->query($sqlTopicSub);
            $num_topic = $result_sub->num_rows;

            //if ($result_sub->num_rows > 0) {
            $i = 0;
            $data_sub = [];
            while ($row_sub = $result_sub->fetch_assoc()) {

                $i++;
                $row_sub['topic_no'] = $No . '.' . $i; // เพิ่มค่า $i เข้าไปใน $row_sub
                //$rows[count($rows) - 1]['sub_data'][$k-1] = $row_sub; // เก็บข้อมูลใน sub_data ของ row ล่าสุด

                // ผู้ชี้แจงข้อสักถาม
                $sqlForeman = "SELECT * FROM  mt_foreman 
                WHERE agendatopic_code = '$row_sub[agendatopic_code]'";
                $resultForeman = $conn->query($sqlForeman);
                //$numrow = $resultForeman->num_rows;
                $data_foreman = [];
                // ตรวจสอบผลลัพธ์
                while ($row_foreman = $resultForeman->fetch_assoc()) {
                    $data_foreman[] = $row_foreman;
                }

                // วาระย่อย 2
                $sqlTopicSub2 = "SELECT * FROM  mt_agendatopic agt 
                    WHERE agt.agendatopic_prarent = '$row_sub[agendatopic_code]' 
                    ORDER BY agt.agendatopic_code ASC";

                // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
                $result_sub2 = $conn->query($sqlTopicSub2);
                //$numrow = $result_topic_sub->num_rows;
                $data_sub2 = [];
                $k = 0;
                while ($row_sub2 = $result_sub2->fetch_assoc()) {
                    $k++;

                    $row_sub2['topic_no2'] = $No . '.' . $i . '.' . $k; // เพิ่มค่า $i เข้าไปใน $row_sub 
                    $data_sub2[] = $row_sub2;
                }

                $row_sub['data_sub2'] = $data_sub2; // เก็บข้อมูลใน data_sub2 ของ row_sub ล่าสุด
                $row_sub['data_foreman'] = $data_foreman; // เก็บข้อมูลใน ผู้ชี้แจงข้อสักถาม

                $data_sub[] = $row_sub;
            }
            //}

            $rows[] = array(
                'No' => $No,
                'open_code' => $row['open_code'],
                'topic_code' => $row['topic_code'],
                'topic_name' => $row['topic_name'],
                'agendatopic_code' => '0',
                'num_topic' => $num_topic,
                'sub_data' => $data_sub
            );
        }
        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $rows, 'row' => $numrow, 'resp'=>$sql));
    } else {
        $data = array();
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('data' => $data, 'resp' => $sqlTopicSub));
    }
}

/**  ข้อมูลประชุมของผู้เข้าร่วมประชุม */
else if($opt == 'viewMeetingUser') {
    // รับค่าจากคำขอ
    $person_id = $request->person_id;
    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_person p
    LEFT JOIN mt_meeting mt ON p.meeting_code = mt.meeting_code
    LEFT JOIN mt_program pg ON mt.program_code = pg.program_code
    LEFT JOIN mt_meeting_open mto ON mt.open_code = mto.open_code
    WHERE p.citizen_id = '$person_id' 
    GROUP BY p.meeting_code 
    ORDER BY mt.meeting_sdate ASC
    ";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $No = 0;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $data, 'row' => $numrow));
    } else {
        $data = array();
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('data' => $data, 'resp' => ''));
    }
}

/** วาระการประชุมของผู้เข้าร่วมประชุม */
else if ($opt == 'viewAgendaTopicUser') {

    //$topic_code = $request->topic_code;
    $meeting_code = $request->meeting_code;
    $open_code = $request->open_code;
    $citizen_id = $request->cid;

    // สร้างคำสั่ง SQL เพื่อดึงข้อมูลนักศึกษาจากฐานข้อมูล
    $sql = "SELECT * FROM  mt_meeting_topic mtt
    LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
    WHERE mtt.open_code = '$open_code'";

    // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
    $result = $conn->query($sql);
    $numrow = $result->num_rows;
    $No = 0;
    // ตรวจสอบผลลัพธ์
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $No++;
            $topic_code = $row['topic_code'];
            // วาระย่อย 1
            $sqlTopicSub = "SELECT * FROM  mt_agendatopic agt 
            WHERE agt.topic_code = '$topic_code'
            AND agt.meeting_code = '$meeting_code' 
            AND agt.agendatopic_prarent = '0' 
            AND agt.agendatopic_rstatus = 'Y'
            ORDER BY agt.agendatopic_code ASC";

            // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
            $result_sub = $conn->query($sqlTopicSub);
            //$numrow2 = $result_sub->num_rows;

            //if ($result_sub->num_rows > 0) {
            $i = 0;
            $data_sub = [];
            while ($row_sub = $result_sub->fetch_assoc()) {

                $i++;
                $row_sub['topic_no'] = $No . '.' . $i; // เพิ่มค่า $i เข้าไปใน $row_sub
                //$rows[count($rows) - 1]['sub_data'][$k-1] = $row_sub; // เก็บข้อมูลใน sub_data ของ row ล่าสุด

                // ผู้ชี้แจงข้อสักถาม
                $sqlForeman = "SELECT * FROM  mt_foreman 
                WHERE agendatopic_code = '$row_sub[agendatopic_code]'";
                $resultForeman = $conn->query($sqlForeman);
                $num_foreman = $resultForeman->num_rows;
                $data_foreman = [];
                // ตรวจสอบผลลัพธ์
                while ($row_foreman = $resultForeman->fetch_assoc()) {
                    
                    $data_foreman[] = $row_foreman;
                }
                // วาระย่อย 2
                $sqlTopicSub2 = "SELECT * FROM  mt_agendatopic agt 
                        WHERE agt.agendatopic_prarent = '$row_sub[agendatopic_code]' 
                        AND agt.agendatopic_rstatus = 'Y'
                        ORDER BY agt.agendatopic_code ASC";

                // ดำเนินการส่งคำสั่ง SQL และรับผลลัพธ์
                $result_sub2 = $conn->query($sqlTopicSub2);
                //$numrow = $result_topic_sub->num_rows;
                $data_sub2 = [];
                $k = 0;
                while ($row_sub2 = $result_sub2->fetch_assoc()) {
                    $k++;

                    // ผู้ชี้แจงข้อสักถาม
                    $sqlForeman2 = "SELECT * FROM  mt_foreman 
                    WHERE agendatopic_code = '$row_sub2[agendatopic_code]'";
                    $resultForeman2 = $conn->query($sqlForeman2);
                    $num_foreman2 = $resultForeman2->num_rows;
                    $data_foreman2 = [];
                    // ตรวจสอบผลลัพธ์
                    while ($row_foreman2 = $resultForeman2->fetch_assoc()) {
                        
                        $data_foreman2[] = $row_foreman2;
                    }


                    $row_sub2['num_foreman'] = $num_foreman2; //จำนวนผู้ชี้แจง
                    $row_sub2['topic_no2'] = $No . '.' . $i . '.' . $k; // เพิ่มค่า $i เข้าไปใน $row_sub 
                    $data_sub2[] = $row_sub2;
                }
                $row_sub['num_foreman'] = $num_foreman; //จำนวนผู้ชี้แจง
                $row_sub['data_sub2'] = $data_sub2; // เก็บข้อมูลใน data_sub2 ของ row_sub ล่าสุด
                $row_sub['data_foreman'] = $data_foreman; // เก็บข้อมูลใน ผู้ชี้แจงข้อสักถาม

                $data_sub[] = $row_sub;
            }
            //}

            $rows[] = array(
                'No' => $No,
                'open_code' => $row['open_code'],
                'topic_code' => $row['topic_code'],
                'topic_name' => $row['topic_name'],
                'agendatopic_code' => '0',
                'sub_data' => $data_sub,
                
            );
        }

        //ตำแหน่งการประชุม
        $sqlPerson = "SELECT * FROM  mt_person p
        LEFT JOIN mt_meeting_position mtp ON p.mtposition_code = mtp.mtposition_code
        WHERE p.citizen_id = '$citizen_id' 
        AND p.meeting_code = '$meeting_code' ";

        $result_person = $conn->query($sqlPerson);
        
        while ($row_person = $result_person->fetch_assoc()) {
            $data_person[] = $row_person;
        }

        // แปลงข้อมูลเป็นรูปแบบ JSON และส่งกลับไปยังแอปพลิเคชัน Angular
        header('Content-Type: application/json');
        echo json_encode(array('data' => $rows, 'row' => $numrow, 'data_person' => $data_person));
    } else {
        $data = array();
        // ถ้าไม่พบข้อมูลนักศึกษา
        echo json_encode(array('data' => $data, 'resp' => $sqlTopicSub));
    }
}

/** วาระการประชุมของผู้เข้าร่วมประชุม */
else if ($opt == 'viewMeetingCount') {

    //meeting_rstatus = '1' ดำเนินการเสนอวาระ
    //meeting_rstatus = '2' อยู่ระหว่างการจัดประชุม
    //meeting_rstatus = '3' ปิดประชุม
    $fac_code = $request->fac_code;

    // จัดการประชุม
    $sql = "SELECT open_code FROM  mt_meeting_open
    WHERE faculty_code = '$fac_code'";
    $result = $conn->query($sql);
    $total_meeting = $result->num_rows; 

    // เสนอวาระ
    $sql_agency = "SELECT agency_code FROM  mt_agency
    WHERE faculty_code = '$fac_code' 
    AND agency_rstatus = '1' 
    AND agency_astatus = '1'";
    $result_agency = $conn->query($sql_agency);
    $total_agency = $result_agency->num_rows; 

    // ดำเนินการจัดการประชุม
    $sql_conduct = "SELECT meeting_code FROM  mt_meeting mt 
    LEFT JOIN mt_user u ON mt.user_id = u.user_id
    WHERE u.faculty_code = '$fac_code'
    AND meeting_rstatus = '1'
    AND meeting_astatus = '1'";
    $result_conduct = $conn->query($sql_conduct);
    $total_conduct = $result_conduct->num_rows; 

    // บันทึกมติการประชุม
    
    $sql_save = "SELECT meeting_code FROM  mt_meeting mt 
    LEFT JOIN mt_user u ON mt.user_id = u.user_id
    WHERE u.faculty_code = '$fac_code'
    AND meeting_rstatus = '2'
    AND meeting_astatus = '1'";
    $result_save = $conn->query($sql_save);
    $total_save = $result_save->num_rows; 

    $data = array(
        "total_meeting"=>$total_meeting,
        "total_agency"=>$total_agency,
        "total_conduct"=>$total_conduct,
        "total_save"=>$total_save
    );

    header('Content-Type: application/json');
    echo json_encode(array('data' => $data));
   
}

/** วาระการประชุมของผู้เข้าร่วมประชุม */
else if ($opt == 'viewTopicDetail') {

    $agendatopic_code = $request->agendatopic_code;

    // จัดการประชุม
    $sql = "SELECT * FROM  mt_agendatopic
    WHERE agendatopic_code = '$agendatopic_code'";
    $result = $conn->query($sql);

    $row = $result->fetch_assoc();
      
    $data[] = $row;

    header('Content-Type: application/json');
    echo json_encode(array('data' => $data, 'resp'=>$sql));
   
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
