import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-certify',
  templateUrl: './report-certify.component.html',
  styleUrls: ['./report-certify.component.css']
})
export class ReportCertifyComponent {
  userData: any;
  fac_code: any;
  user_id: any;
  user_fname: any;
  user_lname: any;
  agency_list: any;
  fac_name: any;
  citizen_id: any;
  user_role: any;
  counts: any = {};
  total_meeting: any;
  total_meeting_pass: any;
  reportData: any;
  meeting: any = {};
  report_stime: any;
  report_etime: any;

  src = 'https://pims.rmutsv.ac.th/api/uploads/pdf/singup-info/info.pdf';
  //src = 'https://e-doc.rmutsv.ac.th/document/edoc/D0026/2022/DOC180D1663832881_edoc_2022-09-22-11.pdf';

  //sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://e-doc.rmutsv.ac.th/document/edoc/D0026/2022/DOC180D1663832881_edoc_2022-09-22-11.pdf');

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
    this.getUser();
    this.fetchReport(this.fac_code);
    this.fetchMeetingCount(this.fac_code);
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    console.log('user:, ', this.userData);
    this.fac_code = this.userData.faculty_code;
    this.fac_name = this.userData.faculty_name;
    this.user_id = this.userData.user_id;
    this.user_fname = this.userData.user_fname;
    this.user_lname = this.userData.user_lname;
    this.citizen_id = this.userData.cid;
    this.user_role = this.userData.user_role; //สิทธิ์การใช้งาน

  }

  // จำนวนประชุมที่เกี่ยวข้อง
  fetchMeetingCount(fac_code: string): void {
    var data = {
      "opt": "viewMeetingCount",
      "fac_code": fac_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('meeting count:  ', res.data); // เเสดงค่าใน console
          this.counts = res.data;
        }
      });
  }

  // รายงาน
  fetchReport(faculty_code: string): void {
    var data = {
      "opt": "viewReport",
      "faculty_code": faculty_code
    }
    this.http.post(environment.baseUrl + '/_view_report.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report:  ', res); // เเสดงค่าใน console
          this.reportData = res.data;
        }
      });
  }

  onClickDetailMeeting(item: any) {
    this.meeting = item;
    console.log('meeting: ', item);
  }

  public selectAll: boolean = false;
  toggleSelectAll() {
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      this.attendances[i] = this.selectAll;
    }
  }

  // สร้างตัวแปรเก็บสถานะการเข้าร่วมของแต่ละบุคคล
  public attendances: boolean[] = [];

  rconfirm:any = {};

  // ฟังก์ชันสำหรับการบันทึกข้อมูล
  sendConfirmReport(item: any, meeting_code: any) {

    console.log(this.meeting);
    const dataToSave = [];
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      //if (this.attendances[i]) {
        const person = this.meeting.data_person[i];
        const confirmData = {
          personCode: person.person_code,
          personName: person.person_name,
          position: person.mtposition_name,
          person_mail: person.person_mail,
          attendAnces: person.attendances
        };
        dataToSave.push(confirmData);
      //}
    }
   
    // ส่งข้อมูลที่ต้องการบันทึกไปยังเซิร์ฟเวอร์ หรือทำอย่างอื่นตามต้องการ
    var data = {
      "opt": "sendReportConfirm",
      "meeting_code": meeting_code,
      "confirm_date": item.confirm_date,
      "confirm_link": item.confirm_link,
      "confirm_subject": item.confirm_subject,
      "confirm_detail": item.confirm_detail,
      "report_data": dataToSave,
      "user_id": this.user_id
    }

    console.log('', data);

    this.http.post(environment.baseUrl + '/_report_certify_sendconfirm.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report detail:  ', res); // เเสดงค่าใน console

          if (res.data.status == 'Ok') {
            Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
              //this.fetchTopicMeeting();
            })
          }

        }
      });

  }

  // รายงาน
  viewReportPdfTest(meeting_code: string): void {
    var data = {
      "opt": "viewReportPdf",
      "meeting_code": meeting_code
    }
    this.http.post(environment.pdfUrl + '/_report_meeting_certify.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report:  ', res); // เเสดงค่าใน console
          //this.reportData = res.data;
        }
      });
  }

  // Open file
  openWindowWithUrl(url: string): void {
    //const sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //console.log(sanitizedUrl);
    window.open(url, '_blank');
    //window.open(sanitizedUrl.toString(), '_blank');
  }

  // view file
  async viewReportPdf(meeting_code: any) {
    let path = environment.pdfUrl + '/_report_meeting_certify.php?meeting_code=' + meeting_code;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

  // ในส่วนของคลาส
  showMessage: boolean = true;

  // ในส่วนของ function ที่เรียกใช้เมื่อต้องการแสดงข้อความ
  showMessageFunction() {
    this.showMessage = true;
  }

  // ในส่วนของ function ที่เรียกใช้เมื่อต้องการซ่อนข้อความ
  hideMessageFunction() {
    this.showMessage = false;
  }

}
