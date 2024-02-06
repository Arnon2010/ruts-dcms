import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meeting-time',
  templateUrl: './meeting-time.component.html',
  styleUrls: ['./meeting-time.component.css']
})
export class MeetingTimeComponent {
  outsiderForm!: FormGroup;
  meetingForm!: FormGroup;
  considerForm!: FormGroup;

  user: any = {};

  //รายการหน่วยงานเข้าร่วม
  agencys: any = {};
  agency_list: any;

  // คณะกรรมการพิจารณาวาระ 
  considers: any = {};
  consider_list: any;

    //ตำแหน่ง
    keyword = 'name'; //ค้นหาด้วยชื่อ
    data_person = []; // รายชื่อ
    person: any = {};
    position_list: any;
    position_code: any;

  p: number = 1;
  collection: any = [];
  FAClist: any;
  users: any[] = [];
  meetings: any[] = [];
  filteredItems: any[] = [];
  userData: any;
  searchText: any;
  total_row: any;
  prefix_list: any;
  open_code: any;
  open_title: any;

  //meeting
  meeting: any = {
    propose_code: '01',
    channel_code: '01',
    action_submit: 'Insert'
  };

  selectedFiles: File[] = [];
  meeting_list: any;
  person_type: string = '01';


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute
  ) {

    this.meetingForm = this.fb.group({
      meeting_thetime: ['', Validators.required],
      propose_code: ['', Validators.required],
      channel_code: ['', Validators.required],
      meeting_sdate: ['', Validators.required],
      meeting_edate: ['', Validators.required],
      meeting_fdate: ['', Validators.nullValidator],
      meeting_time: ['', Validators.required],
      meeting_location: ['', Validators.nullValidator],
      meeting_link: ['', Validators.nullValidator],
      meeting_id: ['', Validators.nullValidator],
      meeting_passcode: ['', Validators.nullValidator],
      meeting_doc: ['', Validators.required]
    });

    //considerForm
    this.considerForm = this.fb.group({
      person_id: ['', Validators.required],
      position_code: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.user.action_submit = 'Insert';
    this.open_code = this.route.snapshot.paramMap.get('id');
    this.open_title = this.route.snapshot.paramMap.get('name');

    this.fetchMeeting(this.open_code);
    this.getFac();
    this.fetchPosition();
  }

  selectEvent(item: any) {
    //console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }

  onChangeSearch(val: string) {
    //console.log('search query: ', val);
    //console.log('person type: ', this.person_type);
    if (this.person_type == '01') {
      this.getPerson(val);
    } else {
      this.getPersonOutsider(val);

    }

  }

  onFocused(e: any) {
    // do something when input is focused
  }

 

  // Consider data list คณะกรรมการพิจารณาวาระ
  fetchConsider(meeting_code:any) {
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
    let meeting_code = this.considers.meeting_code;
    this.considers.position_code = position_code;
    this.considers.citizen_id = id;
    this.considers.person_name = name;
    this.considers.action = "Insert";

    const result_check = this.addConsiderCheck(meeting_code, id);
    console.log('result_check: ', result_check);
    //return false;

    console.log('considers: ', this.considers);
    this.http.post(environment.baseUrl + '/_meeting_consider_add.php', this.considers).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchConsider(meeting_code);
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
  removeConsider(item: any, meeting_code:any) {
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
              Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
                this.fetchConsider(meeting_code);
              })
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
      "opt": "viewNAME",
      "search": search_query
    }
    this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
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

  getUserData(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    //console.log('userdata:, ', this.userData); //เเสดงค่า studentData ใน console
  }

  getFac(): void {
    var data = {
      opt: 'viewfac',
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

  // upload file book order
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

  }

  // Meeting time save.

  saveMeeting(item: any) {
    this.meeting = item;
    console.log('save meeting', this.meeting);
    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('meeting_doc[]', this.selectedFiles[i]);
    }

    formData.append('user_id', this.meeting.user_id);
    formData.append('propose_code', this.meeting.propose_code);
    formData.append('channel_code', this.meeting.channel_code);
    formData.append('meeting_link', this.meeting.meeting_link);
    formData.append('meeting_id', this.meeting.meeting_id);
    formData.append('meeting_passcode', this.meeting.meeting_passcode);
    formData.append('meeting_location', this.meeting.meeting_location);
    formData.append('meeting_thetime', this.meeting.meeting_thetime);
    formData.append('meeting_sdate', this.meeting.meeting_sdate);
    formData.append('meeting_edate', this.meeting.meeting_edate);
    formData.append('meeting_time', this.meeting.meeting_time);
    formData.append('meeting_fdate', this.meeting.meeting_fdate);

    formData.append('action_submit', this.meeting.action_submit);

    formData.append('open_code', this.open_code);
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_meeting_save.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.fetchMeeting(this.open_code);
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

  // Fetch data meeting
  fetchMeeting(open_code: any) {
    this.http
      .get(environment.baseUrl + '/_meeting_data.php?open_code=' + open_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log('meeting data: ', res);
        this.meeting_list = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
      });
  }

  /** Consider  */

  


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
    this.agencys.faculty_code = agency.code;
    this.agencys.agency_name = agency.name;
    this.agencys.action = "Insert";

    console.log('agencys: ', this.agencys);
    this.http.post(environment.baseUrl + '/_meeting_agency_add.php', this.agencys).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchAgency(this.agencys.meeting_code);
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
    console.log('agencys: ', this.agencys);
    this.http.post(environment.baseUrl + '/_meeting_agency_remove.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
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

}
