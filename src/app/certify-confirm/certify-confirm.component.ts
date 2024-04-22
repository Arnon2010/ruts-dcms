import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-certify-confirm',
  templateUrl: './certify-confirm.component.html',
  styleUrls: ['./certify-confirm.component.css']
})
export class CertifyConfirmComponent {
  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this.fb.group({
    thirdCtrl: ['', Validators.required]
  });
  forFormGroup = this.fb.group({
    forCtrl: ['', Validators.required]
  });

  meeting_code: any;
  userData: any;
  user_id: any;
  faculty_code: any;
  agendatopic_list: any;
  meeting: any = {};
  open_title: any;
  open_code: any;
  person_id: any;
  cid: any;
  person: any = {};
  person_position: any;
  topics: any = {
    action_submit: 'Insert'
  };
  person_code: any;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    //this.agency_code = this.route.snapshot.paramMap.get('id');
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    this.open_code = this.route.snapshot.paramMap.get('open_code');
    this.getUser();
    this.dataMeetingUser(this.meeting_code);
    
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log('user data token: ', this.userData);
    this.user_id = this.userData.user_id;
    this.faculty_code = this.userData.faculty_code;
    this.cid = this.userData.cid;
  }

  dataMeetingUser(meeting_code: any): void {
    var data = {
      "opt": 'viewMeetingData',
      "meeting_code": meeting_code,
      "cid": this.cid
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('meeting data: ', res); // เเสดงค่าใน console
          this.meeting = res.data;
          this.open_title = this.meeting.open_title;
          this.open_code = this.meeting.open_code;
          this.person_code = this.meeting.person_code;

          this.fetchAgendaTopicUser(this.person_code);

          //console.log(this.person_code);

          // // วันที่ปัจจุบัน
          // const currentDate: Date = new Date();

          // // วันที่เราต้องการเปรียบเทียบ
          // const targetDate: Date = new Date(this.meeting.meeting_sdate);

          // // เปรียบเทียบวันที่
          // if (currentDate.getTime() < targetDate.getTime()) {
          //     console.log("วันที่ปัจจุบันน้อยกว่าวันที่ " + targetDate);
          //     console.log("วันที่จาก database " + currentDate.getTime());
          //     this.meeting.meeting_ostatus = 'W';
          // } else if (currentDate.getTime() > targetDate.getTime()) {
          //     console.log("วันที่ปัจจุบันมากกว่าวันที่ " + this.meeting.meeting_sdate);
          // } else {
          //     console.log("วันที่ปัจจุบันเท่ากับวันที่ " + this.meeting.meeting_sdate);
          // }
        }
      });
  }


  // ระเบียบวาระการประชุม ของผู้เข้าร่วม
  fetchAgendaTopicUser(person_code:any): void {
    var data = {
      "opt": "viewAgendaTopicUser",
      "open_code": this.open_code,
      "meeting_code": this.meeting_code,
      "cid": this.cid,
      "person_code": person_code,
    }

    console.log('view agenda topic: ', data);
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('agendatopic_list user: ', res);
          this.agendatopic_list = res.data;
          this.person = res.data_person[0];
          this.person_position = res.data_person;
          console.log(this.person);
        }
      });
  }


  openWindowWithUrl(url: string): void {
    const sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //console.log(sanitizedUrl);
    window.open(url, '_blank');
    //window.open(sanitizedUrl.toString(), '_blank');

  }

  async openAnyFile(file_path: any) {
    let path = environment.vieFile + file_path;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

  //meeting-topic

  onClickModalTopic(agendatopic_code: any) {

    var data = {
      "opt": "viewCorrectionPerson",
      "agendatopic_code": agendatopic_code,
      "person_code": this.person.person_code,
    }
    console.log('Topic detail:', data);
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('topic data: ', res);
          this.topics = res.data[0];
        }
      });
  }

  //แก้ไขมติการประชุม
  submitEditTopic(item: any) {
    var data = {
      "action_submit": item.action_submit,
      "agendatopic_code": item.agendatopic_code,
      "correction_text": item.correction_text,
      "person_code": this.person.person_code,
    }

    console.log('certify edit:', item);

    this.http.post(environment.baseUrl + '/_certify_confirm_edit.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('certify update: ', res);
          if (res.status == 'Ok') {
            Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
              this.dataMeetingUser(this.meeting_code);
            })
          }
        }
      });
  }


  onClickCertify(item:any) {

     Swal.fire({
        title: 'ยืนยันรับรองรายงานการประชุม',
        text: 'ท่านต้องการรับรองการประชุมนี้ใช่หรือไม่? หลังจากท่านได้รับรองการประชุมนี้แล้ว กรุณาตรวจสอบให้แน่ใจว่าไม่ต้องการแก้ไขข้อมูลอีก',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยันการรับรองการประชุม',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          

          var data = {
            "action_submit": "Update",
            "meeting_code": this.meeting_code,
            "person_code": this.person.person_code,
          }
      
          console.log('certify edit:', item);
      
          this.http.post(environment.baseUrl + '/_certify_confirm_report.php', data)
            .subscribe({
              next: (res: any) => {
                console.log('certify update: ', res);
                if (res.status == 'Ok') {
                  // Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {

                  // })

                  this.router.navigate(['certify'], {}); // ผู้ดูแลระบบ
                }
              }
            });
        }
      });

  }

  
}
