import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
// import { IGX_STEPPER_DIRECTIVES } from 'igniteui-angular';
// import { HammerModule } from '@angular/platform-browser';

// import { IgxStepperComponent } from 'igniteui-angular';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css']
})
export class MeetingCreateComponent {
  title = 'stepper';

  meetingForm!: FormGroup;

  fruits: Array<string> = ["apple", "pear", "kiwi", "banana", "grape", "strawberry", "grapefruit", "melon", "mango", "plum"];

  formGroup!: FormGroup;


  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  meeting: meetingSet = {
    meeting_code: 0, //รหัสการประชุม
    faculty_code: '', //รหัสการประชุม
    user_id: 0, //รหัสการประชุม
    type_code: '1', //รหัสประเภทการประชุม
    propose_code: '01', //วาระการประชุม
    channel_code: '01', //ช่องทางการประชุม
    program_code: '', //รหัสช่องทางการประชุม
    meeting_link: '', //Link เข้าประชุม
    meeting_id: '', //Link รหัสไอดีเข้าประชุม
    meeting_passcode: '', //Link รหัสผ่านเข้าประชุม
    meeting_location: '', //สถานที่ประชุม
    meeting_book: '', //เลขหนังสือ
    meeting_name: '', //ชื่อการประชุม
    meeting_thetime: '', //ครั้งที่
    meeting_year: '', //ปี
    meeting_sdate: '', //วันที่เริ่ม
    meeting_edate: '', //วันที่สิ้นสุด
    meeting_time: '', //เวลา
    meeting_fdate: '', //วันที่สิ้นสุดการเสนอวาระ
    action_submit: 'Insert', // Add or Update
  }

  p: number = 1;
  collection: any = [];
  FAClist: any;
  users: any[] = [];
  filteredItems: any[] = [];
  userData: any;
  searchText: any;
  total_row: any;
  type_meeting: any;
  type_list: any;
  meetings: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService
  ) {


    this.meetingForm = this.fb.group({
      type_code: ['1', Validators.required],
      meeting_name: ['', Validators.required],
      meeting_book: ['', Validators.required],
      propose_code: ['', Validators.required],
      channel_code: ['', Validators.required],
      meeting_thetime: ['', Validators.required],
      meeting_year: ['', Validators.required],
      meeting_sdate: ['', Validators.required],
      meeting_edate: ['', Validators.required],
      meeting_fdate: ['', Validators.required],
      meeting_time: ['', Validators.required],
      meeting_location: ['', Validators.required],
      meeting_link: ['', Validators.required],
      meeting_id: ['', Validators.required],
      meeting_passcode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFac();
    this.fetchTypeMeeting();
    this.getUser();
    this.fetchDataMeeting();
    
  }

  onSearch() {
    this.filteredItems = this.users.filter((item: any) => {
      //console.log('item: ',item);
      //return item.user_fname.toLowerCase().includes(this.searchText.toLowerCase());
      return (
        item.user_fname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.user_lname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.user_epassport.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.role_status.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    console.log('user:, ', this.userData);
    this.meeting.faculty_code = this.userData.faculty_code;
    this.meeting.user_id = this.userData.user_id;
  }

  getFac(): void {
    var data = {
      opt: 'viewTable',
      "Table": "FACULTY"
    }
    this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('Faculty ', res); // เเสดงค่าใน console
          this.FAClist = res;
        }
      });
  }

  fetchTypeMeeting() {
    this.http
      .get(environment.baseUrl + '/_type_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.type_list = res.data;
      });
  }

  fetchDataMeeting() {
    this.http
      .get(environment.baseUrl + '/_meeting_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log(res);
        this.meetings = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
      });
  }

  // Add and Update User.
  saveMeeting(item: any) {
    this.meeting = item;
    console.log('save meeting', this.meeting);
    this.http.post(environment.baseUrl + '/_meeting_save.php', this.meeting).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            // get users
            this.fetchDataMeeting();

            // set local storage
            localStorage.setItem('token-meeting', JSON.stringify(response)); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token
          })
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

  // edit user
  onClickEditUser(data: any) {
    this.meeting = data;
    this.meeting.meeting_code = data.meeting_code; // id user
    this.meeting.action_submit = 'Update'; // Update ข้อมูล
  }
}

export interface meetingSet {
  meeting_code: Number;
  faculty_code: String;
  user_id: Number;
  type_code: String;
  propose_code: String;
  channel_code: String;
  program_code: String;
  meeting_link: String;
  meeting_id: String;
  meeting_passcode: String;
  meeting_location: String;
  meeting_book: String;
  meeting_name: String;
  meeting_thetime: String;
  meeting_year: String;
  meeting_sdate: String;
  meeting_edate: String;
  meeting_time: String;
  meeting_fdate: String;
  action_submit: String; // Add or Update
}
