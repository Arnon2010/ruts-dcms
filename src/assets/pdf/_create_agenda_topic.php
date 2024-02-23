<?php
include_once "../api/db.php";

//รับค่า
$meeting_code = $_GET['meeting_code'];


require_once('vendor/autoload.php');
// create new PDF document
$pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

define('THSARABUN_REGULAR', TCPDF_FONTS::addTTFfont('vendor/tecnickcom/tcpdf/fonts/thaifont/THSarabun.ttf', 'TrueTypeUnicode'));
define('THSARABUN_BOLD', TCPDF_FONTS::addTTFfont('vendor/tecnickcom/tcpdf/fonts/thaifont/THSarabun Bold.ttf', 'TrueTypeUnicode'));

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('ระเบียบวาระการประชุม');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');


// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
    require_once(dirname(__FILE__) . '/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// // // ---------------------------------------------------------


// // set header
$pdf->setPrintHeader(false);
//$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);

// Set footer
//$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set margins
$pdf->SetMargins(30, 0, 20);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// Add a page
$pdf->AddPage();

// Image example with resizing
//$pdf->Image('image/1800400340853.jpg', 30, 15, 0, 15, 'JPG', '', '', true, 150, '', false, false, 0, false, false, false);
//$img = file_get_contents('https://reg.rmutsv.ac.th/regis2file/thungyai/stdImage/1800400340853.jpg');
// $img = 'https://e-service.rmutsv.ac.th/faisol/rutsapp/img/virtual-card-back.png';
// $pdf->Image('https://e-service.rmutsv.ac.th/faisol/rutsapp/img/virtual-card-back.png',43,1,15,15,'PNG');
//$pdf->Image($img, 30, 15, 0, 15, 'PNG', '', '', true, 150, '', false, false, 0, false, false, false);
// $pdf->Image('@' . $img);


$sql = "SELECT mto.open_code,mto.open_title, mt.meeting_thetime, mt.meeting_location FROM  mt_meeting mt
LEFT JOIN mt_meeting_open mto ON mt.open_code = mto.open_code
WHERE mt.meeting_code = '$meeting_code'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();


$pdf->SetY(20);
$pdf->SetFont(THSARABUN_BOLD, 'B', 16);
// Print text
$pdf->Cell(0, 0, 'ระเบียบวาระการประชุม', 0, 1, 'C', 0, '', 0);
$pdf->Cell(0, 0, $row['open_title'], 0, 1, 'C', 0, '', 0);
$pdf->Cell(0, 0, 'ครั้งที่ ' . $row['meeting_thetime'], 0, 1, 'C', 0, '', 0);
$pdf->Cell(0, 0, 'ณ ' . $row['meeting_location'], 0, 1, 'C', 0, '', 0);
$pdf->Cell(0, 0, 'และผ่านระบบออนไลน์โปรแกรม Zoom Meeting', 0, 1, 'C', 0, '', 0);

// $pdf->SetFont(THSARABUN_BOLD, 'B', 20);
// // Print text
// $pdf->Cell(30, 0, 'ส่วนราชการ', 0, 1, 'L', 0, '', 0);

// $pdf->SetFillColor(255, 255, 255);
// $pdf->SetY(34);
// $pdf->SetX(55);
// $pdf->SetFont(THSARABUN_REGULAR, '', 16);
// $government_text = "สำนักวิทยบริการและเทคโนโลยีสารสนเทศ มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย 
// โทร. ๐๗-๔๓๑๗-๑๔๖ โทรสาร. ๐๗-๔๓๑๗-๑๔๗ เบอร์ภายใน ๑๑๖๐, ๓๐๓๐";
// $pdf->MultiCell(0, 2, $government_text, 0, 'L', 1, 0, '', '', true);

$pdf->Ln();
$pdf->SetFont(THSARABUN_REGULAR, '', 16);

$sql_topic = "SELECT * FROM  mt_meeting_topic mtt 
LEFT JOIN mt_topic t ON mtt.topic_code = t.topic_code
WHERE mtt.open_code = '$row[open_code]'";

$result_topic = $conn->query($sql_topic);
$no_topic = 0;
while ($row_topic = $result_topic->fetch_assoc()) {
    $no_topic++;
    $pdf->Cell(5, 0, 'ระเบียบวาระที่ ' . $no_topic . ' ' . $row_topic['topic_name'], 0, 0, 'L', 0, '', 0);
    $pdf->Ln();
    //วาระย่อย 1
    $topic_code = $row_topic['topic_code'];
    $sqlTopicSub = "SELECT * FROM  mt_agendatopic agt 
        WHERE agt.topic_code = '$topic_code'
            AND agt.meeting_code = '$meeting_code' 
            AND agt.agendatopic_prarent = '0'
            AND agt.agendatopic_rstatus = 'Y'
            ORDER BY agt.agendatopic_no ASC";
    $result_sub = $conn->query($sqlTopicSub);
    while($row_topicsub = $result_sub->fetch_assoc()){
        $pdf->SetX(54);
        $pdf->Cell(5, 0, $row_topicsub['agendatopic_no'] . ' ' . $row_topicsub['agendatopic_name'], 0, 0, 'L', 0, '', 0);
        $pdf->Ln();
    }

    //วาระย่อย 2

}


// create some HTML content
// $html = '<h1>HTML Example</h1>
// <br />
// <br />
// <h2>
//     ทดสอบ
// </h2>
// <div style="text-align:center">IMAGES<br />
// <img src="https://e-service.rmutsv.ac.th/faisol/rutsapp/img/virtual-card-back.png" alt="test alt attribute" width="100" height="100" border="0" />
// </div>

// <p style="background-image: url(https://e-service.rmutsv.ac.th/faisol/rutsapp/img/virtual-card-back.png)">
// ';

// output the HTML content
$pdf->writeHTML($html, true, false, true, false, '');




//$date_timestamp = date('m/d/Y H:i:s', 1687026425);
//$pdf->Cell(0, 0, $date_timestamp , 0, 1, 'C', 0, '', 0);

// test Cell stretching
// $pdf->Cell(0, 0, 'TEST CELL STRETCH: no stretch', 1, 1, 'C', 0, '', 0);
// $pdf->Cell(0, 0, 'TEST CELL STRETCH: scaling', 1, 1, 'C', 0, '', 1);

// Print text

// ---------------------------------------------------------

// // Close and output PDF document
// // This method has several options, check the source code documentation for more information.
// // Save the modified PDF to the server
// $outputFilePath = 'document/modified.pdf';
// //read
$pdf->Output('ระเบียบวาระ.pdf', 'I');
// // save to server
// $pdf->Output(__DIR__ . '/document/modified.pdf', 'F');
$pdf->Close();
