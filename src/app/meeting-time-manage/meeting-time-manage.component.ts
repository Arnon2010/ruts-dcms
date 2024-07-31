import { Component, Injectable, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meeting-time-manage',
  templateUrl: './meeting-time-manage.component.html',
  styleUrls: ['./meeting-time-manage.component.css']
})
export class MeetingTimeManageComponent {
  readonly DELIMITER = '-';

  startDate: NgbDateStruct | undefined;
  endDate: NgbDateStruct | undefined;
  model: NgbDateStruct | undefined;
  date: { year: number; month: number; } | undefined;

  outsiderForm!: FormGroup;
  meetingForm!: FormGroup;
  considerForm!: FormGroup;
  agencyForm!: FormGroup;
  searchForm!: FormGroup;
  personForm!: FormGroup;
  mtpositionForm!: FormGroup;
  topicForm!: FormGroup;

  // steper จัดการประชุม
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

  isLinear = true;
  title = 'stepper';
 
  type_list: any;
  open_file: any;
  topic_list: any;
  mttopic_list: any;


  //ตำแหน่ง
  keyword = 'name'; //ค้นหาด้วยชื่อ
  data_person = []; // รายชื่อ
  person: any = {};
  position_list: any;
  position_code: any;

 // ผู้เข้าร่วมประชุม
  mtposition_name: any;
  mtposition_list: any;
  mtposition_code: any;
  person_list:any = {};
  persons: any = {
    person_type: '1'
  };

  user: any = {};

  //รายการหน่วยงานเข้าร่วม
  agencys: any = {};
  agency_list: any;

  // คณะกรรมการพิจารณาวาระ 
  considers: any = {};
  consider_list: any;

  // พิจารณาวาระ
  topic: any = {};

  p: number = 1;
  collection: any = [];
  FAClist: any;
  users: any[] = [];
  filteredItems: any[] = [];
  userData: any;
  searchText: any;
  total_row: any;
  prefix_list: any;
  open_code: any;
  open_title: any;

  //meeting
  meeting: any = {};

  selectedFiles: File[] = [];
  meeting_list: any;
  person_type: string = '01';

  faculty_code: any;
  user_id: any;
  channels: any;
  program_list: any;
  meeting_code: any;
  topic_confirm: any = {};

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {

    //considerForm
    this.considerForm = this.fb.group({
      person_id: ['', Validators.required],
      position_code: ['', Validators.required]
    });

    //channel
    this.channels = [
      { id: '1', name: 'onsite' },
      { id: '2', name: 'online' },
      { id: '3', name: 'onsite/online' }
    ];

    //personForm
    this.personForm = this.fb.group({
      person_id: ['', Validators.required],
      mtposition_code: ['', Validators.required],
      person_type: ['', Validators.required]
    });

    // พิจารณาวาระ
    this.topicForm = this.fb.group({
      agendatopic_no: ['', Validators.required],
      agendatopic_name: ['', Validators.required],
      agendatopic_origin: ['', Validators.required],
      agendatopic_offer: ['', Validators.required],
      agendatopic_doc: ['', Validators.required],
      foreman_code: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    this.getUser();
    this.user.action_submit = 'Insert';
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    this.open_code = this.route.snapshot.paramMap.get('open_code');
    this.meetingData(this.meeting_code);
    this.getFac();
    this.fetchPosition();
    this.fetchProgram();

    this.fetchAgency(this.meeting_code);
    this.fetchConsider(this.meeting_code);
    this.fetchTopicMeeting();
    this.fetchPerson(this.meeting_code);
    this.fetchMtPosition(this.open_code);

    //console.log('meeting: ', this.meeting);
  }


  meetingData(meeting_code: any): void {
    var data = {
      "opt": 'viewMeetingData',
      "meeting_code": meeting_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('meeting data: ', res); // เเสดงค่าใน console
          this.meeting = res.data;
          this.open_title = this.meeting.open_title;
        }
      });
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    this.user_id = this.userData.user_id;
    this.faculty_code = this.userData.faculty_code;

    console.log(this.faculty_code);
    //console.log('userdata:, ', this.userData); //เเสดงค่า studentData ใน console
  }

  // Open file
  openWindowWithUrl(url: string): void {
    const sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //console.log(sanitizedUrl);
    window.open(url, '_blank');
    //window.open(sanitizedUrl.toString(), '_blank');
  }

  // view file
  async openAnyFile(file_path: any) {
    let path = environment.vieFile + file_path;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

  selectEvent(item: any) {
    console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }



  onChangeSearch(val: string) {
    //console.log('search query: ', val);
    //console.log('person type: ', this.person_type);
    if (this.persons.person_type == '1') {
      this.getPerson(val);
    } else {
      this.getPersonOutsider(val);

    }

    // if (this.person_type == '01') {
    //   this.getPerson(val);
    // } else {
    //   this.getPersonOutsider(val);
    // }

  }

  onFocused(e: any) {
    // do something when input is focused
  }

  clearSearch() {
    this.keyword = ''; // เคลียร์คีย์เวิร์ดค้นหา
    // ล้างค่าที่ถูกเลือก (ถ้ามี)
  }


  // Consider data list คณะกรรมการพิจารณาวาระ
  fetchConsider(meeting_code: any) {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_meeting_consider_data.php?meeting_code=' + meeting_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        this.consider_list = res.data;
        //console.log( ' this.consider_list: ',this.consider_list);

      });
  }

  addConsiderCheck(meeting_code: any, id: string): string {
    const checkPerson = this.consider_list.find((item: { citicen_id: string; }) => item.citicen_id === id);
    console.log('check person: ', this.consider_list);
    return checkPerson ? checkPerson.person_name : checkPerson;
  }

  // show modal agency
  onClickConsider(item: any) {
    console.log('meeting_code: ', item);
    this.considers.meeting_code = item;

    this.fetchConsider(item);
  }

  // add consider
  addConsider(position_code: any, id: any, name: string) {
    this.considers.meeting_code = this.meeting_code;
    this.considers.position_code = position_code;
    this.considers.citizen_id = id;
    this.considers.person_name = name;
    this.considers.action = "Insert";

    //const result_check = this.addConsiderCheck(this.meeting_code, id);
    //console.log('result_check: ', result_check);
    //return false;

    console.log('considers: ', this.considers);
    this.http.post(environment.baseUrl + '/_meeting_consider_add.php', this.considers).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchConsider(this.meeting_code);
          //this.clearSearch();
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

  // Delete consider ลบคณะกรรมการผู้พิจารณา
  removeConsider(item: any, meeting_code: any) {
    let data = {
      "id": item,
      "action": "delete"
    }
    //console.log('item: ',item);
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณต้องการที่จะลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบ!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(environment.baseUrl + '/_meeting_consider_remove.php', data).subscribe(
          (res: any) => {
            //console.log(response);
            if (res.status == 'Ok') {
              //Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
              this.fetchConsider(meeting_code);
              //})
            }
          },
          (error) => {
            Swal.fire('ลบข้อมูลไม่สำเร็จ!', '', 'error').then(() => {
              //this.reloadPage();
            })
            //console.log('Error uploading files');
            console.error(error); // แสดงข้อผิดพลาดที่เกิดขึ้น
            // ทำการจัดการข้อผิดพลาดตามต้องการ
          }
        );
      }
    });
  }

  // Position data list
  fetchPosition() {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_position_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.position_list = res.data;
      });
  }

  // บุคคลภายใน
  getPerson(search_query: string): void {
    var data = {
      "opt": "viewNAMEPOSITION",
      "search": search_query
    }
    // this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
    //   .subscribe({
    //     next: (res: any) => {
    //       //console.log('Person ', res); // เเสดงค่าใน console
    //       this.data_person = res;
    //     }
    //   });

      this.http.post(environment.baseUrl + '/_curl_acc3d_person.php', data)
        .subscribe({
          next: (res: any) => {
            //console.log('Person ', res); // เเสดงค่าใน console
            this.data_person = res;
          }
        });
  


  }

  // บุคคลภายนอก
  getPersonOutsider(search_query: string): void {
    var data = {
      "opt": "viewNAME",
      "search": search_query
    }
    this.http.post(environment.baseUrl + '/_outsider_person.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('Outsider ', res); // เเสดงค่าใน console
          this.data_person = res.data;
          if (Array.isArray(res.data)) {
            // Your existing filter code here
          } else {
            console.error("this data is not an array:", res);
          }
        }
      });
  }

  onSearch() {
    this.filteredItems = this.users.filter((item: any) => {
      //console.log('item: ',item);
      //return item.user_fname.toLowerCase().includes(this.searchText.toLowerCase());
      return (
        item.outsider_fname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_lname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_username.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_agency.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_agency.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_phone.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  getFac(): void {
    var data = {
      opt: 'viewfac',
      "Table": "FACULTY"
    }
    this.http.post(environment.baseUrl + '/_curl_acc3d_person.php', data)
        .subscribe({
          next: (res: any) => {
            //console.log('Person ', res); // เเสดงค่าใน console
            this.FAClist = res;
          }
        });
  }

  // upload file book order
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

  }

  // Program meeting online
  fetchProgram() {
    this.http
      .get(environment.baseUrl + '/_program_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log('program data: ', res);
        this.program_list = res.data;
      });
  }

  // Fetch data meeting
  fetchMeeting(open_code: any) {
    this.http
      .get(environment.baseUrl + '/_meeting_data.php?open_code=' + open_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log('meeting data: ', res);
        this.meeting_list = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
      });
  }


  getFacultyName(facultyCode: string): string {
    const selectedFaculty = this.FAClist.find((item: { FACULTY_CODE: string; }) => item.FACULTY_CODE === facultyCode);
    return selectedFaculty ? selectedFaculty.FACULTY_TNAME : '';
  }

  // show modal agency
  onClickAgency(item: any) {
    this.agencys.meeting_code = item;
    this.fetchAgency(item);
  }

  // Agency data list
  fetchAgency(meeting_code: any) {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_meeting_agency_data.php?meeting_code=' + meeting_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.agency_list = res.data;
      });
  }

  addAgency(agency: { code: string, name: string }): void {
    this.agencys.meeting_code = this.meeting_code;
    this.agencys.faculty_code = agency.code;
    this.agencys.agency_name = agency.name;
    this.agencys.action = "Insert";

    //console.log('agencys: ', this.agencys);
    this.http.post(environment.baseUrl + '/_meeting_agency_add.php', this.agencys).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchAgency(this.meeting_code);
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

  removeAgency(item: any, meeting_code: any) {
    let data = {
      action: 'delete',
      agency_code: item
    };
    //console.log('agencys: ', this.agencys);
    this.http.post(environment.baseUrl + '/_meeting_agency_remove.php', data).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchAgency(meeting_code);
        }
      },
      (error) => {
        Swal.fire('ไม่สามารถลบข้อมูลได้', '', 'error').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        console.log('Error adduser: ', error);
      }
    );
  }

  // แก้ไขการประชุม
  // show modal agency
  onClickEditMeeting(item: any) {
    //console.log('meeting time: ', item);
    //console.log('getToday: ', this.ngbCalendar.getToday());
    this.meeting = item;
    //this.meeting.meeting_sdate = this.dateAdapter.fromModel(item.meeting_sdate);
    this.meeting.action_submit = 'Update';
  }

  // Close modal
  resetFormSubmit() {
    this.meetingForm.reset();
    this.meeting.action_submit = 'Insert';
    this.fetchMeeting(this.open_code);

  }

  //step 5 confirm
  confirmDone() {

  }

  // ระเบียบวาระ
  fetchTopicMeeting() {
    var data = {
      "opt": "veiwAgendaManage",
      "open_code": this.open_code,
      "meeting_code": this.meeting_code,
    }
    //console.log('meeting topic', data);
    this.http.post(environment.baseUrl + '/_view_data.php', data).subscribe(
      (res: any) => {
        //console.log('mttopic_list: ', res);
        this.mttopic_list = res.data;
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

  // Agenda topic.

  onClickCheckTopic(item: any) {
    this.topic = item;
    //console.log('topic detail: ', this.topic);
  }

  //ผู้เข้าร่วมประชุม
  // เพิ่มผู้เข้าร่วมประชุม Person
  addPerson(item: any, id: any, name: string, position:string, faculty_code:any, faculty:string, mail:any) {
    this.persons.meeting_code = this.meeting_code;
    this.persons.citizen_id = id;
    this.persons.person_name = name;
    this.persons.position_work = position;
    this.persons.faculty_code = faculty_code;
    this.persons.faculty_name = faculty;
    this.persons.person_mail = mail;
    this.persons.action = "Insert";
    // const result_check = this.addConsiderCheck(meeting_code, id);
    // console.log('result_check: ', result_check);
    //return false;
    //console.log('persons: ', this.persons);
    this.http.post(environment.baseUrl + '/_meeting_person_add.php', this.persons).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchPerson(this.meeting_code);
          //this.personForm.reset();
          this.persons.person_type = '1';
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

   // delete ผู้เข้าร่วมประชุม
   delPerson(item: any) {
    //console.log(item);
    let data = {
      "id": item.person_code,
      "action": "delete"
    }
    //console.log('item: ',item);
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณต้องการที่จะลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบ!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(environment.baseUrl + '/_meeting_person_remove.php', data).subscribe(
          (res: any) => {
            this.fetchPerson(item.meeting_code);
            
          },
          (error) => {
            Swal.fire('ลบข้อมูลไม่สำเร็จ!', '', 'error').then(() => {
              //this.reloadPage();
            })
            //console.log('Error uploading files');
            console.error(error); // แสดงข้อผิดพลาดที่เกิดขึ้น
            // ทำการจัดการข้อผิดพลาดตามต้องการ
          }
        );
      }
    });
  }

  // Person data
  fetchPerson(meeting_code: any) {
    this.http
      .get(environment.baseUrl + '/_meeting_person_data.php?meeting_code=' + meeting_code)
      .subscribe((res: any) => {
        //console.log('person: ', res);
        this.person_list = res.data;
      });
  }

  // Meeting position
  fetchMtPosition(open_code: any) {
    //console.log('open_code: ', open_code);
    this.http
      .get(environment.baseUrl + '/_meeting_position_data.php?open_code=' + open_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.mtposition_list = res.data;
      });
  }

  // Agenda topic.

  confirmCheckAgendaTopic(item: any, confirm_status:any) {
    
    // var data = {
    //   "opt":"confirmAgendaTopic",
    //   "agendatopic_code": agendatopic_code,
    //   "confirm_status":confirm_status
    // }

    this.topic_confirm = item;
    this.topic_confirm.confirm_status = confirm_status;
    this.topic_confirm.opt = "confirmAgendaTopic";

    //console.log('topic_confirm', this.topic_confirm);
    this.http.post(environment.baseUrl + '/_agenda_manage_confirm.php', this.topic_confirm).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.fetchTopicMeeting();
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

}
