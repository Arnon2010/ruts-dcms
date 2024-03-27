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
	NgbDateParserFormatter,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

import '@angular/localize/init';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}


@Component({
  selector: 'app-meeting-time',
  templateUrl: './meeting-time.component.html',
  styleUrls: ['./meeting-time.component.css'],
})
export class MeetingTimeComponent {


  faUsers=faUsers;

  readonly DELIMITER = '-';

  startDate: NgbDateStruct | undefined;
  endDate: NgbDateStruct | undefined;


	model: NgbDateStruct | undefined;
	date: { year: number; month: number; } | undefined;

  outsiderForm!: FormGroup;
  meetingForm!: FormGroup;
  considerForm!: FormGroup;

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
  agencyForm!: FormGroup;
  searchForm!: FormGroup;
  personForm!: FormGroup;
  mtpositionForm!: FormGroup;
  type_list:any;
  open_file: any;
  topic_list:any;
  meeting_manage: any = {};

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
    program_code: '01',
    action_submit: 'Insert'
  };

  selectedFiles: File[] = [];
  meeting_list: any;
  person_type: string = '01';

  faculty_code: any;
  user_id: any;
  channels:any;
  program_list: any;
  opens: any = {};
  files_vew: any = [];
  datafiles: any;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private calendar: NgbCalendar,
    private ngbCalendar: NgbCalendar,
		private dateAdapter: NgbDateAdapter<string>,
  ) {

    this.meetingForm = this.fb.group({
      meeting_thetime: ['', Validators.required],
      propose_code: ['', Validators.required],
      channel_code: ['', Validators.required],
      program_code: ['01', Validators.nullValidator],
      meeting_sdate: ['', Validators.required],
      meeting_edate: ['', Validators.required],
      meeting_fdate: ['', Validators.nullValidator],
      meeting_time: ['', Validators.required],
      meeting_location: ['', Validators.nullValidator],
      meeting_link: ['', Validators.nullValidator],
      meeting_id: ['', Validators.nullValidator],
      meeting_passcode: ['', Validators.nullValidator],
      meeting_doc: ['', Validators.nullValidator]
    });

    //considerForm
    this.considerForm = this.fb.group({
      person_id: ['', Validators.required],
      position_code: ['', Validators.required]
    });

    //channel
    this.channels = [
      {id:'1', name:'onsite'}, 
      {id:'2', name:'online'}, 
      {id:'3', name:'onsite/online'}
    ];

  }

  ngOnInit(): void {

    this.getUser();
    this.user.action_submit = 'Insert';
    this.open_code = this.route.snapshot.paramMap.get('open_code');
    //this.open_title = this.route.snapshot.paramMap.get('open_title');
    this.fetchMeeting(this.open_code);
    this.getFac();
    this.fetchPosition();
    this.fetchProgram();
    this.getOpenMeeting(this.open_code);
  }

   getOpenMeeting(open_code: any) {
    let data = {
      "opt": 'viewOpenMeeting',
      "open_code": open_code,
      
    };
    //console.log('open meeting data: ', data);
    this.http.post(environment.baseUrl + '/_view_data.php', data).subscribe(
      (res: any) => {
        console.log(res);
        this.opens = res.data[0];

      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  get today() {
		return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
	}

  toModel(date: NgbDateStruct | null): string | null {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
	}

  selectToday() {
    this.startDate = this.calendar.getToday();
    this.endDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10); // เลือกวันที่สิ้นสุดเป็น 10 วันข้างหน้า
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

   // data file document
   onClickOpenFile(item:any) {
    this.datafiles = item;
  }
  
  // view file
  async openAnyFile(file_path: any) {
    let path = environment.vieFile + file_path;
    console.log(path);
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
    if (this.person_type == '01') {
      this.getPerson(val);
    } else {
      this.getPersonOutsider(val);
    }

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
    let meeting_code = this.considers.meeting_code;
    this.considers.position_code = position_code;
    this.considers.citizen_id = id;
    this.considers.person_name = name;
    this.considers.action = "Insert";

    const result_check = this.addConsiderCheck(meeting_code, id);
    //console.log('result_check: ', result_check);
    //return false;
    //console.log('considers: ', this.considers);
    this.http.post(environment.baseUrl + '/_meeting_consider_add.php', this.considers).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchConsider(meeting_code);
          this.clearSearch();
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
  // onFileChange(event: any) {
  //   const files: FileList = event.target.files;
  //   this.selectedFiles = [];
  //   for (let i = 0; i < files.length; i++) {
  //     this.selectedFiles.push(files[i]);
  //   }
  // }

  // upload file book order
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
    //console.log('Files: ', this.selectedFiles);
    this.files_vew = [];
    // Loop through each selected file to create view files
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      // Create a view file for each selected file
      const viewFile = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );

      // Push the view file to the array of view files
      this.files_vew.push(viewFile);
    }
    console.log('view file: ', this.files_vew);
  }

  viewFile(file: any) {
    this.open_file = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }

  // Program meeting online
  fetchProgram() {
    this.http
      .get(environment.baseUrl + '/_program_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log('program data: ', res);
        this.program_list = res.data;
      });
  }

  // 
  onClickManageMeeting(item:any) {
    this.meeting_manage = item;
    console.log('meeting_manage',this.meeting_manage);
    this.fetchAgency(item.meeting_code);
  }

  // Meeting time save

  saveMeeting(item: any) {
    this.meeting = item;
    console.log('save meeting', this.meeting);

    //const date_sdate = toModel(this.meeting.meeting_sdate);

    //let meeting_sdate = this.meeting.meeting_sdate.year + '-' + this.meeting.meeting_sdate.month + '-' + this.meeting.meeting_sdate.day;
    //let meeting_edate = this.meeting.meeting_edate.year + '-' + this.meeting.meeting_edate.month + '-' + this.meeting.meeting_edate.day;
    //let meeting_fdate = this.meeting.meeting_fdate.year + '-' + this.meeting.meeting_fdate.month + '-' + this.meeting.meeting_fdate.day;

    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file_doc[]', this.selectedFiles[i]);
    }

    formData.append('action_submit', this.meeting.action_submit);
    formData.append('open_code', this.open_code);
    formData.append('meeting_code', this.meeting.meeting_code);

    formData.append('user_id', this.user_id);
    formData.append('faculty_code', this.faculty_code);
    formData.append('propose_code', this.meeting.propose_code);
    formData.append('program_code', this.meeting.program_code);
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
    formData.append('meeting_doc', this.meeting.meeting_doc);

    
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_meeting_save.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.resetFormSubmit();
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

// Delete consider ลบคณะกรรมการผู้พิจารณา
removeMeeting(meeting_code: any) {
  let data = {
    "meeting_code": meeting_code,
    "action": "Delete"
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
      this.http.post(environment.baseUrl + '/_meeting_remove.php', data).subscribe(
        (res: any) => {
          //console.log(response);
          if (res.status == 'Ok') {
            //Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
              this.fetchMeeting(this.open_code);
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

// copy meeting
copyMeeting(meeting_code:any): void {
  let data = {
    "meeting_code": meeting_code,
    "user_id": this.user_id,
    "action": "Copy"
  }
  this.http.post(environment.baseUrl + '/_meeting_copy.php', data).subscribe(
    (response: any) => {
      console.log('response: ', response);
      if (response.status == 'Ok') {
        Swal.fire('ทำสำเนาสำเร็จ!', '', 'success').then(() => {
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
    this.agencys.meeting_code = this.meeting_manage.meeting_code;
    this.agencys.agency_name = agency.name;
    this.agencys.faculty_code = agency.code;

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
    this.meeting.doc_files = [];
    this.selectedFiles = [];
    this.fetchMeeting(this.open_code);

  }

  /** ลบไฟล์ */
  delFile(item:any, index:any) {
    let data = {
      action: 'removeFile',
      opt: 'meetingDocFile',
      doc_code: item.meetingdoc_code,
      doc_path: item.meetingdoc_path,
    };

    console.log(data);
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
        this.http.post(environment.baseUrl + '/_remove_file.php', data).subscribe(
          (res: any) => {
            if (res.status == 'Ok') {
                this.meeting.doc_files.splice(index, 1);

            }
          },
          (error) => {
            Swal.fire('ลบข้อมูลไม่สำเร็จ!', '', 'error').then(() => {
              //this.reloadPage();
            })
            console.error(error); // แสดงข้อผิดพลาดที่เกิดขึ้น
          }
        );
      }
    });
  }

  //step 5 confirm
  confirmDone() {
    
  }

}
