import { Component, OnInit } from '@angular/core';
import {  FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent {

  personForm!: FormGroup;
  meetingForm!: FormGroup;

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
  report_stime:any;
  report_etime:any;

  src = 'https://e-doc.rmutsv.ac.th/document/edoc/D0026/2022/DOC180D1663832881_edoc_2022-09-22-11.pdf';
  //src = 'https://pims.rmutsv.ac.th/api/uploads/pdf/singup-info/info.pdf';

    //ผู้เข้าร่วมประชุม
    keyword = 'name'; //ค้นหาด้วยชื่อ
    data_person = []; // รายชื่อ
    person: any = {};

  //ผู้เข้าร่วม/ผู้สังเกตการณ์
  personObs: any = {
    person_rstatus: '01'
  };
  person_observe: any;

  toggle_add_person:boolean = false;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private sanitizer: DomSanitizer,
  ) {
     //personForm
     this.personForm = this.fb.group({
      person_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.fetchReport(this.fac_code);
    this.fetchMeetingCount(this.fac_code);

    this.meetingForm = this.fb.group({
      selectAll: [false], // เพิ่มเข้าไป
      persons: this.fb.array([
        // this.fb.group({
        //   attendances: [false],
        //   person_name: [''],
        //   mtposition_name: [''],
        //   attendInstead: [''],
        //   attendNote: ['']
        // }),
        // เพิ่มบุคคลอื่นๆตามต้องการ
      ])
    });
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

  onClickSaveDetail(item:any) {
    this.meeting = item;
    this.getPersonObserve(this.meeting.meeting_code);
    console.log('meeting: ',item);

    // const arrayPersons: Array<any> = item.data_person; //เรียน

    // arrayPersons.forEach((element) => {
    //   this.getPerson(element);
    // });
  }

   /** form ctrl receiver (เรียน) */
   get persons(): FormArray {
    return this.meetingForm.get("persons") as FormArray
  }

  // แก้ไขเรียน
  getPerson(item:any) {
    //console.log('item persons: ',item);
      if (item && item.person_name && item.mtposition_name) { // ตรวจสอบข้อมูลก่อนการสร้าง form control
      const psForm = this.fb.group({
        attendances: [false],
        person_name: [item.person_name, Validators.required],
        mtposition_name: [item.mtposition_name , Validators.required],
        attendInstead: ['dd', Validators.required],
        attendNote: ['dd', Validators.required]
      })
      this.persons.push(psForm);
      console.log(this.persons);
    } else {
      console.error('Invalid item data:', item); // แสดงข้อความแจ้งเตือนในกรณีที่ข้อมูลไม่ถูกต้อง
    }
  }

  public selectAll: boolean = false;
  toggleSelectAll() {
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      this.attendances[i] = this.selectAll;
    }
  }

  // สร้างตัวแปรเก็บสถานะการเข้าร่วมของแต่ละบุคคล
  public attendances: boolean[] = [];
  
  // ฟังก์ชันสำหรับการบันทึกข้อมูล
  saveReportDetail(meeting_code:any) {
    const dataToSave = [];
    for (let i = 0; i < this.meeting.data_person.length; i++) {
      //if (this.attendances[i]) {
        const person = this.meeting.data_person[i];
        const attendanceData = {
          attendAnces: person.attendances,
          personCode: person.person_code,
          personName: person.person_name,
          position: person.mtposition_name,
          attendInstead: person.person_instead,
          attendNote: person.person_note
        };
        dataToSave.push(attendanceData);
      //}
    }
    console.log(dataToSave);
    // ส่งข้อมูลที่ต้องการบันทึกไปยังเซิร์ฟเวอร์ หรือทำอย่างอื่นตามต้องการ
    var data = {
      "opt": "saveReportDetail",
      "report_stime": this.report_stime,
      "report_etime": this.report_etime,
      "meeting_code": meeting_code,
      "report_data": dataToSave,
      "user_id": this.user_id
    }
    this.http.post(environment.baseUrl + '/_report_detail_save.php', data)
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

  
  closeModalPerson() {
    //this.fetchAgendaTopic(this.meeting.open_code);
  }

  selectEvent(item: any) {
    console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }

  onChangeSearch(val: string) {
    //console.log('search query: ', val);
    this.fetchPerson(val);

  }

  onFocused(e: any) {
    // do something when input is focused
  }

  // บุคคลภายใน
  fetchPerson(search_query: string): void {
    var data = {
      "opt": "viewNAMEPOSITION"
      , "search": search_query
    }
    this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('Person ', res); // เเสดงค่าใน console
          this.data_person = res;
        }
      });
  }

  // เพิ่มผู้เข้าร่วมชี้แจง
  addPerson(item: any, meeting_code:any) {
    //this.persons.mtposition_code = item.;
    this.personObs.meeting_code = meeting_code;
    this.personObs.citizen_id = item.CITIZEN_ID;
    this.personObs.position_work = item.POSITION_WORK;
    this.personObs.faculty_name = item.FACULTY_TNAME;
    this.personObs.person_name = item.name;
    this.personObs.action = "Insert";

    console.log('person add: ', this.personObs);
    this.http.post(environment.baseUrl + '/_report_detail_person_add.php', this.personObs).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.getPersonObserve(meeting_code);
          this.personForm.reset();
        }
      },
      (error) => {
        Swal.fire('ไม่สามารถบันทึกข้อมูลได้', '', 'error').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        console.log('Error adduser: ', error);
      }
    );
  }

  // ผู้เข้าร่วมสังเกตการณ์ที่ประชุม
  getPersonObserve(meeting_code: any): void {
    var data = {
      "opt": "viewPersonObserve",
      "meeting_code": meeting_code
    }
    console.log(data);
    this.http.post(environment.baseUrl + '/_view_report.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report:  ', res); // เเสดงค่าใน console
          this.person_observe = res.data;
          //this.reportData = res.data;
        }
      });
  }

  //delete person
  delPerson(item:any) {
    var data = {
      "action": "delete",
      "id": item.person_code
    }
    //console.log(data);
    this.http.post(environment.baseUrl + '/_meeting_person_remove.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('del person:  ', res); // เเสดงค่าใน console
          this.getPersonObserve(item.meeting_code);
          //this.reportData = res.data;
        }
      });
  }

}
