import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; 


@Component({
  selector: 'app-meeting-setting',
  templateUrl: './meeting-setting.component.html',
  styleUrls: ['./meeting-setting.component.css']
})
export class MeetingSettingComponent implements OnInit  {

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

  myControl = new FormControl('');
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  filteredOptions!: Observable<string[]>;

  isLinear = true;

  title = 'stepper';
  meetingForm!: FormGroup;
  agencyForm!: FormGroup;
  searchForm!: FormGroup;
  considerForm!: FormGroup;
  personForm!: FormGroup;
  mtpositionForm!: FormGroup;


  meeting: any = {
    type_code: '1',
    propose_code: '01',
    action_submit: 'Insert'
  };

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
  //Upload
  selectedFiles: File[] = [];
  fileUpload: File[] = [];
  datafiles: any;

  topic_list: any;
  topic_done: any;
  topics: any = {};

  //รายการหน่วยงานเข้าร่วม
  agencys: any = {};
  agency_list: any;

  //ตำแหน่ง
  keyword = 'name'; //ค้นหาด้วยชื่อ
  data_person = []; // รายชื่อ
  person: any = {};
  position_list: any;
  position_code: any;

  mtposition_name: any;
  mtposition_list: any;
  mtposition_code: any;

  // คณะกรรมการพิจารณาวาระ 
  considers: any = {};
  consider_list: any;

  // ผู้เข้าร่วมประชุม
  persons: any = {
    person_rstatus: '01'
  };
  person_list: any;
  data_person_outsider = [];
  isLogin: boolean | Observable<boolean>;
  open: any = {};
  image: any;
  open_file: any;
  positions: any = {};
  fac_code: any;
  user_id: any;
  files_vew: any = [];

  myModal:any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private modalService: NgbModal
  ) {
    this.isLogin = this.dataService.isLoggedIn();
    this.meetingForm = this.fb.group({
      type_code: ['1', Validators.required],
      open_title: ['', Validators.required],
      open_order: ['', Validators.nullValidator],
      open_path: ['', Validators.nullValidator],
      open_year: ['', Validators.required],
    });

    

    //position Form
    this.mtpositionForm = this.fb.group({
      mtposition_name: ['', Validators.required]
    });

    //considerForm
    this.considerForm = this.fb.group({
      person_id: ['', Validators.required],
      position_code: ['', Validators.required]
    });

    //personForm
    this.personForm = this.fb.group({
      person_id: ['', Validators.required],
      mtposition_code: ['', Validators.required],
      person_rstatus: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.getFac();
    this.fetchTypeMeeting();
    this.getUser();
    this.fetchOpenMeeting();
    //this.fetchMtPosition();

    this.fetchPosition();
    this.fetchConsider();

    this.meeting.faculty_code = this.fac_code;
    this.meeting.user_id = this.user_id;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogFormOpenDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    console.log('user:, ', this.userData);
    this.fac_code = this.userData.faculty_code;
    this.user_id = this.userData.user_id;
  }

  fetchDocument(fileUrl: any) {
    //pass document url to the service
    return this.http.post(
      `http://localhost:3000/mydocuments/${fileUrl}`,
      {},
      {
        responseType: 'arraybuffer',
      }
    );
  }

  downloadPDF(content: any) {
    //make a call to the service passing in document url
    this.fetchDocument(content)
      .subscribe(
        (response: any) => {
          let array = new Uint8Array(response);
          //service returns an array buffer so convert array buffer to blob
          let file = new Blob([array], { type: 'application/pdf' });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        },
        (err) => {
          console.error(err);
        }
      );
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
    //this.open_file =path;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

  // data file document
  onClickOpenFile(item:any) {
    this.datafiles = item;
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

  /** Open meeting. */

  // ลบไฟล์
  removeFile(path: any, open_code: any) {
    let data = {
      "action": 'Delete',
      "open_code": open_code,
      "path": path
    };
    console.log('del: ', data);
    this.http.post(environment.baseUrl + '/_meetingopen_file_remove.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.meeting.open_path = '';
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
    //console.log('view file: ', this.files_vew);
  }

  viewFile(file: any) {
    this.open_file = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }

  // Open meeting save.

  saveOpenMeeting(item: any) {
    this.meeting = item;
    console.log('save meeting', this.meeting);
    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('open_path[]', this.selectedFiles[i]);
    }

    formData.append('user_id', this.meeting.user_id);
    formData.append('faculty_code', this.meeting.faculty_code);
    formData.append('type_code', this.meeting.type_code);
    formData.append('propose_code', this.meeting.propose_code);
    formData.append('open_title', this.meeting.open_title);
    formData.append('open_order', this.meeting.open_order);
    formData.append('open_code', this.meeting.open_code);
    formData.append('open_year', this.meeting.open_year);
    formData.append('action_submit', this.meeting.action_submit);

    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_meetingopen_save.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          //Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
          // get users
          this.fetchOpenMeeting();
          // meeting code
          this.meeting.open_code = response.open_code;
          this.fetchTopic(this.meeting.open_code); // หัวข้อระเบียบวาระ
          this.fetchTopicDone(this.meeting.open_code); // หัวข้อวาระที่เลือก
          this.isLinear = false;
          this.selectedFiles = [];

          //this.meeting.action_submit = 'Update'; // Update ข้อมูล
          //})
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

  // Copy meeting


  // Open meeting data

  fetchTypeMeeting() {
    this.http
      .get(environment.baseUrl + '/_type_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.type_list = res.data;
      });
  }

  fetchOpenMeeting() {
    this.http
      .get(environment.baseUrl + '/_meetingopen_data.php?faculty_code=' + this.fac_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log(res);
        this.meetings = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
      });
  }

  delOpenMeeting(open_code: any) {
    let data = {
      "open_code": open_code,
      "action": "delete" //update astatus = '1'
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
        this.http.post(environment.baseUrl + '/_meetingopen_remove.php', data).subscribe(
          (res: any) => {
            //console.log(response);
            this.fetchOpenMeeting();
            // if (res.status == 'Ok') {
            //   Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
            //     this.fetchDataMeeting();
            //   })
            // }
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

  /** Position meeting */

  // add position
  addMtPosition(item: any): void {
    this.positions.mtposition_name = item;
    this.positions.open_code = this.meeting.open_code;
    this.positions.action = "Insert";

    console.log('positions: ', this.positions);
    this.http.post(environment.baseUrl + '/_meeting_position_add.php', this.positions).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.mtpositionForm.reset();
          this.fetchMtPosition(this.meeting.open_code);
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

  removeMtPosition(item: any) {
    let data = {
      action: 'delete',
      id: item
    };
    console.log('del: ', data);
    this.http.post(environment.baseUrl + '/_meeting_position_remove.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchMtPosition(this.meeting.open_code);
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

  // Meeting position
  fetchMtPosition(open_code: any) {
    console.log('open_code: ', open_code);
    this.http
      .get(environment.baseUrl + '/_meeting_position_data.php?open_code=' + open_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.mtposition_list = res.data;
      });
  }

  selectEvent(item: any) {
    //console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }

  onChangeSearch(val: string) {
    //console.log('search query: ', val);
    //console.log('person type: ', this.person_type);
    if (this.persons.person_rstatus == '01') {
      this.getPerson(val);
    } else {
      this.getPersonOutsider(val);

    }

  }

  onFocused(e: any) {
    // do something when input is focused
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
          console.log('Person ', res); // เเสดงค่าใน console
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


  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      //console.log('item add: ', event.previousIndex);
    }
  }


  getFacultyName(facultyCode: string): string {
    const selectedFaculty = this.FAClist.find((item: { FACULTY_CODE: string; }) => item.FACULTY_CODE === facultyCode);
    return selectedFaculty ? selectedFaculty.FACULTY_TNAME : '';
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

  /** Consider คณะกรรมการพิจารณา */

  // Consider data list คณะกรรมการพิจารณาวาระ
  fetchConsider() {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_meeting_consider_data.php?meeting_code=' + this.meeting.meeting_code) //ติดต่อไปยัง Api getfaculty.php
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

  addConsider(position_code: any, id: any, name: string) {
    let meeting_code = this.meeting.meeting_code;
    this.considers.position_code = position_code;
    this.considers.citizen_id = id;
    this.considers.person_name = name;
    this.considers.meeting_code = this.meeting.meeting_code;
    this.considers.action = "Insert";

    const result_check = this.addConsiderCheck(meeting_code, id);
    console.log('result_check: ', result_check);
    //return false;

    console.log('considers: ', this.considers);
    this.http.post(environment.baseUrl + '/_meeting_consider_add.php', this.considers).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchConsider();
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
  delConsider(item: any) {
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
                this.fetchConsider();
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


  // Agency data list
  fetchAgency() {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_meeting_agency_data.php?meeting_code=' + this.meeting.meeting_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.agency_list = res.data;
      });
  }

  onSearch() {
    this.filteredItems = this.meetings.filter((item: any) => {
      //console.log('item: ',item);
      //return item.user_fname.toLowerCase().includes(this.searchText.toLowerCase());
      return (
        item.open_title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.open_order.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.open_year.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  /** จัดการข้อมูลผู้เข้าร่วมประชุม */

  selectEventOutsider(item: any) {
    console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }

  onChangeSearchOutsider(val: string) {
    console.log('search query: ', val);
    this.getPersonOutsider(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  // Modal show person
  personAdd(open_code: any) {
    this.persons.open_code = open_code;
    this.fetchPerson(open_code);
    this.fetchMtPosition(open_code);
  }

  // เพิ่มผู้เข้าร่วมประชุม Person
  addPerson(item: any, id: any, name: string) {
    //this.persons.mtposition_code = item.;
    this.persons.citizen_id = id;
    this.persons.person_name = name;
    this.persons.action = "Insert";
    // const result_check = this.addConsiderCheck(meeting_code, id);
    // console.log('result_check: ', result_check);
    //return false;
    console.log('persons: ', this.persons);
    this.http.post(environment.baseUrl + '/_meeting_person_add.php', this.persons).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchPerson(this.persons.open_code);
          this.personForm.reset();
          this.persons.person_rstatus = '01';
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
            this.fetchPerson(item.open_code);
            //console.log(response);
            // if (res.status == 'Ok') {
            //   Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
            //     this.fetchPerson(item.open_code);
            //   })
            // }
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
  fetchPerson(open_code: any) {
    this.http
      .get(environment.baseUrl + '/_meeting_person_data.php?open_code=' + open_code)
      .subscribe((res: any) => {
        console.log('person: ', res);
        this.person_list = res.data;
      });
  }

  /** พิจารณาวาระการประชุม */


  // edit open meeting
  onClickEditMeetingOpen(data: any) {

    this.isLinear = false;
    this.meeting = data;
    console.log(this.meeting);
    this.meeting.open_code = data.open_code; // id user
    this.fetchTopic(data.open_code); // หัวข้อระเบียบวาระ
    this.fetchTopicDone(data.open_code); // หัวข้อวาระที่เลือก
    this.fetchMtPosition(data.open_code); // ตำแหน่งการประชุม
    this.meeting.action_submit = 'Update'; // Update ข้อมูล
  }

  // step 2

  // ระเบียบวาระ
  fetchTopic(open_code: any) {
    console.log(open_code);
    this.http
      .get(environment.baseUrl + '/_topic_data.php?open_code=' + open_code)
      .subscribe((res: any) => {
        console.log('topic list: ', res);
        this.topic_list = res.data;
      });
  }

  // ระเบียบวาระที่เลือกแล้ว
  fetchTopicDone(open_code: any) {
    this.http
      .get(environment.baseUrl + '/_meetingtopic_data.php?open_code=' + open_code)
      .subscribe((res: any) => {
        //console.log('topic done: ', res);
        this.topic_done = res.data;
      });
  }

  addMeetingTopic(item: any) {
    this.topics.topic_done = item;
    this.topics.open_code = this.meeting.open_code;
    console.log('meeting add', this.topics);
    this.http.post(environment.baseUrl + '/_meetingtopic_add.php', this.topics).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          //
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  addTopic(topic_code: any) {

    var data = {
      "opt": "Insert",
      "open_code": this.meeting.open_code,
      "topic_code": topic_code,
    }
    //console.log('meeting add', data);
    this.http.post(environment.baseUrl + '/_meetingtopic_add.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchTopicDone(this.meeting.open_code);
          this.fetchTopic(this.meeting.open_code);
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  removeTopicDone(mttopic_code: any) {
    var data = {
      "opt": 'Delete',
      "mttopic_code": mttopic_code
    }
    this.http.post(environment.baseUrl + '/_meetingtopic_remove.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchTopicDone(this.meeting.open_code);
          this.fetchTopic(this.meeting.open_code);
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  // Add and Remove Topic.
  saveTopic(item: any) {
    this.topics = item;
    //console.log('save meeting', this.topics);
    this.http.post(environment.baseUrl + '/_topic_save.php', this.topics).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          //
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  //step 5 confirm
  confirmDone() {
    this.mtpositionForm.reset();
    this.meetingForm.reset();
    this.fetchOpenMeeting();
    this.isLinear = true;
    this.mtposition_list = [];
    this.topic_done = [];
    this.topic_list = [];
    this.selectedFiles = [];
  }


  confirmMeetingSet(meeting_code: any) {
    console.log('confirm: ', meeting_code);
    let data = {
      "meeting_code": meeting_code,
      "action": "save"
    };
    //console.log('save meeting', this.topics);
    this.http.post(environment.baseUrl + '/_meeting_confirm.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('ยืนยันกำหนดการประชุม และเปิดการยื่นเสนอวาระเสร็จเรียบร้อย!', '', 'success').then(() => {
            //this.fetchConsider();
          })
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  // copy meetin open
  copyOpenMeeting(open_code: any): void {
    let data = {
      "open_code": open_code,
      "user_id": this.user_id,
      "action": "Copy"
    }
    this.http.post(environment.baseUrl + '/_meetingopen_copy.php', data).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('ทำสำเนาสำเร็จ!', '', 'success').then(() => {
            this.fetchOpenMeeting();
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

  /** ลบไฟล์ */
  delFile(item:any, index:any) {
    let data = {
      action: 'removeFile',
      opt: 'openDocFile',
      doc_code: item.opendoc_code,
      doc_path: item.opendoc_path,
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

}

@Component({
  selector: 'dialog-form-open-dialog',
  templateUrl: 'dialog-form-open-dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class DialogFormOpenDialog {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  meetingForm!: FormGroup;

  meeting: any = {};
  type_list: any;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
  ) {
    this.meetingForm = this._formBuilder.group({
      type_code: ['1', Validators.required],
      open_title: ['', Validators.required],
      open_order: ['', Validators.required],
      open_path: ['', Validators.required],
      open_year: ['', Validators.required],
    });

    this.fetchTypeMeeting();
  }

  fetchTypeMeeting() {
    this.http
      .get(environment.baseUrl + '/_type_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log(res);
        this.type_list = res.data;
      });
  }
}
