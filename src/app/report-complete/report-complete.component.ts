import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addYears, format } from 'date-fns';

@Component({
  selector: 'app-report-complete',
  templateUrl: './report-complete.component.html',
  styleUrls: ['./report-complete.component.css']
})
export class ReportCompleteComponent {
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
  person_mail_send: any;
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
    this.fetchReportComplete(this.fac_code);
    this.fetchReportCount(this.fac_code);
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

  formattedDateThai(item: any) {
    const inputDate = new Date(item);
    const thaiDate = addYears(inputDate, 543);
    const formattedThaiDate = format(thaiDate, 'dd/MM/yyyy');
    //console.log(formattedThaiDate); // แสดงผลลัพธ์ เช่น "2567-04-15"
    return formattedThaiDate;
  }

  // จำนวนรายงานการประชุม
  fetchReportCount(fac_code: string): void {
    this.dataService.fetchReportCount(fac_code)
      .then(res => {
        //console.log('Meeting count:', res);
        this.counts = res;
      })
      .catch(error => {
        console.error('Error fetching report count:', error);
      });
  }

  // รายงาน
  fetchReportComplete(faculty_code: string): void {
    var data = {
      "opt": "viewReportComplete",
      "faculty_code": faculty_code
    }
    this.http.post(environment.baseUrl + '/_view_report.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('report:  ', res); // เเสดงค่าใน console
          this.reportData = res.data;
        }
      });
  }

  // รายงานที่เคยยืนยันแล้ว
  fetchReportConfirm(meeting_code: any): void {
    var data = {
      "opt": "viewReportConfirm",
      "meeting_code": meeting_code
    }
    this.http.post(environment.baseUrl + '/_view_report.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report confirm:  ', res); // เเสดงค่าใน console
          //this.reportData = res.data;
          this.rconfirm = res.data[0];
        }
      });
  }

  currentDate: Date = new Date();
  viewSendMailConfirm: boolean = false;//ดูตัวอย่างก่อนส่ง mail

  // รายละเอียดรับรองรายงาน
  onClickDetailMeeting(item: any) {
    this.meeting = item;
    console.log('meeting: ', this.meeting);
  }

  public selectAll: boolean = false;
  // toggleSelectAll() {
  //   for (let i = 0; i < this.meeting.data_person.length; i++) {
  //     this.attendances[i] = this.selectAll;
  //   }
  // }

  // toggleSelectAll() {
  //   this.meeting.data_person.forEach(person => {
  //     person.attendances = this.selectAll;
  //   });
  // }

  // สร้างตัวแปรเก็บสถานะการเข้าร่วมของแต่ละบุคคล
  public attendances: boolean[] = [];

  rconfirm: any = {
    confirm_date: new Date().toISOString().substring(0, 10)
  };

  // ตัวอย่างก่อนส่ง mail
  viewSendConfirmReport(item: any, meeting_code: any) {

    const mailToSend = [];
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      const person = this.meeting.data_person[i];
      if (person.attendances === true) {
        const confirmData = {
          personCode: person.person_code,
          personName: person.person_name,
          position: person.mtposition_name,
          personMail: person.person_mail,
          attendAnces: person.attendances
        };
        mailToSend.push(confirmData);
      }
    }

    this.person_mail_send = mailToSend;

    console.log('view after send to email: ', this.person_mail_send);
    //detail confirm send mail
    this.rconfirm.confirm_detail_confirm = this.rconfirm.confirm_detail + '\nภายในวันที่ ' + this.formattedDateThai(this.rconfirm.confirm_date)
      + ' หากพ้นกำหนดวันดังกล่าว ถือว่าท่านเห็นชอบรับรองรายงานการประชุม ฯ ฉบับดังกล่าว'
      + '\n\n'
      + this.rconfirm.confirm_detail_ending;



  }


  // ฟังก์ชันสำหรับการบันทึกข้อมูล
  async sendConfirmReport(item: any, meeting_code: any) {
    console.log(this.meeting);
    const dataToSave = [];
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      const person = this.meeting.data_person[i];
      const confirmData = {
        personCode: person.person_code,
        personName: person.person_name,
        position: person.mtposition_name,
        personMail: person.person_mail,
        attendAnces: person.attendances
      };
      dataToSave.push(confirmData);
    }

    const data = {
      "opt": "sendReportConfirm",
      "open_title": this.meeting.open_title,
      "open_year": this.meeting.open_year,
      "meeting_thetime": this.meeting.meeting_thetime,
      "meeting_sdate": this.meeting.meeting_sdate,
      "meeting_location": this.meeting.meeting_location,
      "meeting_code": meeting_code,
      "confirm_date": item.confirm_date,
      "confirm_link": item.confirm_link,
      "confirm_subject": item.confirm_subject,
      "confirm_detail": item.confirm_detail,
      "confirm_detail_ending": item.confirm_detail_ending,
      "confirm_detail_confirm": item.confirm_detail_confirm,
      "report_data": dataToSave,
      "user_id": this.user_id
    };

    console.log('confirm send: ', data);

    //if (res.data.status == 'Ok') {
    Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
      //this.fetchTopicMeeting();
    });
    //}

    try {
      const res = await this.http.post(environment.baseUrl + '/_report_certify_sendconfirm.php', data).toPromise();
      console.log('report detail:  ', res);
      //  //if (res.data.status == 'Ok') {
      //   Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
      //     //this.fetchTopicMeeting();
      //   });
      // //}

    } catch (error) {
      console.error('Error occurred:', error);
      // Handle error if necessary
    }
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

  show_correct_id:any = '0';

  showDetailCorrection(item: any) {
    console.log(item);
    if(this.show_correct_id === item.person_code) { //close
      this.show_correct_id = false;
    } else { //open
      this.show_correct_id = item.person_code;

    }
  }

  detailReportCertify(meeting_code: string) {

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
