import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {EditorConfig, ST_BUTTONS} from 'ngx-simple-text-editor';

@Component({
  selector: 'app-agenda-topic-admin',
  templateUrl: './agenda-topic-admin.component.html',
  styleUrls: ['./agenda-topic-admin.component.css']
})
export class AgendaTopicAdminComponent {
  content = '';
  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,
  };
  outsiderForm!: FormGroup;
  topicForm!: FormGroup;
  personForm!: FormGroup;

  meeting: any = {};
  userData: any;
  open_code: any;
  open_title: any;

  //meeting
  topic: any = {
    action_submit: 'Insert',
    agendatopic_offer: '',
    agendatopic_doc: '',
    agendatopic_origin: '',
    agendatopic_issue: '',
  };

  selectedFiles: File[] = [];
  meeting_list: any;
  mttopic_list: any;
  user_id: any;
  agency_code: any;
  meeting_code: any;
  agendatopic_list: any;
  faculty_code: any;

  //ผู้ชี้แจง
  keyword = 'name'; //ค้นหาด้วยชื่อ
  data_person = []; // รายชื่อ
  person: any = {};

  // ผู้เข้าร่วมประชุม
  persons: any = {
    person_rstatus: '01'
  };
  person_list: any;

  opens: any = {};
  files_vew: any = [];
  datafiles: any;
  open_file: any;



  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {

    this.topicForm = this.fb.group({
      agendatopic_no: ['', Validators.required], // ลำดับหัวข้อ
      agendatopic_name: ['', Validators.required], // เรื่อง
      agendatopic_origin: ['', Validators.nullValidator], // รายละเอียด ความเป็นมา
      agendatopic_offer: ['', Validators.nullValidator], // ข้อเสนอเพื่อพิจารณา
      agendatopic_issue: ['', Validators.nullValidator], // ประเด็นที่เสนอ
      agendatopic_doc: ['', Validators.nullValidator], // เอกสารประกอบวาระ
      //foreman_code: ['', Validators.required]
    });

    //personForm
    this.personForm = this.fb.group({
      person_id: ['', Validators.required]

    });
  }

  ngOnInit(): void {

    //this.agency_code = this.route.snapshot.paramMap.get('id');
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    //this.open_title = this.route.snapshot.paramMap.get('title');

    this.fetchMeeting(this.meeting_code);
    this.getUser();
    console.log('faculty_code:, ', this.faculty_code);

    this.selectedFiles = []; //กำหนดค่าเริ่มต้นของไฟล์อัปโหลด
  }


  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    this.user_id = this.userData.user_id;
    this.faculty_code = this.userData.faculty_code;

  }

  // บุคคลภายใน
  getPerson(search_query: string): void {
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

  selectEvent(item: any) {
    console.log('search selectEvent: ', item);
    this.person = item;
    // do something with selected item
  }

  onChangeSearch(val: string) {
    //console.log('search query: ', val);
    this.getPerson(val);

  }

  onFocused(e: any) {
    // do something when input is focused
  }

  // Modal show person
  personAdd(item: any, topic_no: any, topic_name: any) {
    this.persons.agendatopic_code = item;
    this.persons.topic_no = topic_no;
    this.persons.topic_name = topic_name;

    this.fetchPerson(item);
    //this.fetchMtPosition(open_code);
    console.log('foreman: ', this.persons);
  }

  // เพิ่มผู้เข้าร่วมชี้แจง
  addPerson(item: any) {
    //this.persons.mtposition_code = item.;
    this.persons.citizen_id = item.CITIZEN_ID;
    this.persons.position_work = item.POSITION_WORK;
    this.persons.faculty_code = item.FACULTY_CODE;
    this.persons.foreman_name = item.name;
    this.persons.action = "Insert";

    //console.log('Foreman: ', this.persons);
    this.http.post(environment.baseUrl + '/_agenda_topic_foreman_add.php', this.persons).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          this.fetchPerson(this.persons.agendatopic_code);
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

  // Person data foreman ผู้เข้าร่วมชี้แจ้ง
  fetchPerson(code: any) {
    this.http
      .get(environment.baseUrl + '/_agenda_topic_foreman_data.php?agendatopic_code=' + code)
      .subscribe((res: any) => {
        console.log('person: ', res);
        this.person_list = res.data;
      });
  }

  // delete ผู้ชี้แจงข้อสักถาม
  delPerson(item: any) {
    let data = {
      "id": item.foreman_code,
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
        this.http.post(environment.baseUrl + '/_agenda_topic_foreman_remove.php', data).subscribe(
          (res: any) => {
            this.fetchPerson(item.agendatopic_code);
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

  closeModalPerson() {
    this.fetchAgendaTopic(this.meeting.open_code);
  }


  // Fetch data meeting ประชุมแต่ละคร้ัง

  fetchMeeting(meeting_code: any) {
    this.http
      .get(environment.baseUrl + '/_meetingtime_data.php?meeting_code=' + meeting_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log('meeting time: ', res);
        this.meeting = res.data[0];
        this.fetchAgendaTopic(this.meeting.open_code);
        this.meeting.open_title;
        this.meeting.meeting_thetime;

      });
  }

  // ระเบียบวาระ
  fetchTopicMeeting(open_code: any) {
    this.http
      .get(environment.baseUrl + '/_meetingtopic_data.php?open_code=' + open_code)
      .subscribe((res: any) => {
        console.log('mttopic_list: ', res);
        this.mttopic_list = res.data;
      });
  }

  // ระเบียบวาระย่อย
  fetchAgendaTopic(item: any): void {
    var data = {
      "opt": "viewAgendaTopic",
      "open_code": item,
      "meeting_code": this.meeting_code,
      "faculty_code": this.faculty_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('agendatopic_list: ', res);
          this.agendatopic_list = res.data;
        }
      });
  }


  // Agenda topic.
  onClickAddTopic(item: any, agendatopic_code: any) {
    console.log('topic: ', item);
    this.topic.topic_code = item.topic_code;
    this.topic.agendatopic_prarent = agendatopic_code; //หัวข้อวาระย่อยของ ?
    this.topic.action_submit = 'Insert';
  }

  // upload file book order
  onFileChange(event: any) {
    const files: FileList = event.target.files;

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

  deleteFile(index: number) {
    // ลบไฟล์ที่เลือกออกจาก selectedFiles หรือทำการกระทำอื่น ๆ ตามที่คุณต้องการ
    this.selectedFiles.splice(index, 1);
  }

  saveAgendaTopic(item: any) {
    this.topic = item;
    //console.log('save meeting', this.topic);
    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file_doc[]', this.selectedFiles[i]); //เอกสารแนบ
    }

    formData.append('user_id', this.user_id);
    formData.append('meeting_code', this.meeting_code);
    formData.append('faculty_code', this.faculty_code);
    formData.append('topic_code', this.topic.topic_code);
    formData.append('agendatopic_prarent', this.topic.agendatopic_prarent);
    formData.append('agendatopic_no', this.topic.agendatopic_no);
    formData.append('agendatopic_name', this.topic.agendatopic_name);
    formData.append('agendatopic_origin', this.topic.agendatopic_origin);
    formData.append('agendatopic_offer', this.topic.agendatopic_offer);
    formData.append('agendatopic_issue', this.topic.agendatopic_issue);
    formData.append('agendatopic_code', this.topic.agendatopic_code);
    formData.append('agendatopic_doc', this.topic.agendatopic_doc);
    formData.append('action_submit', this.topic.action_submit);

    //console.log('save formData', formData);

    this.http.post(environment.baseUrl + '/_agenda_topic_save_admin.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.fetchAgendaTopic(this.meeting.open_code);
            this.topicForm.reset();
            this.selectedFiles = [];
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

  // remove 
  removeAgendaTopic(open_code: any, agendatopic_code: any, agendatopic_doc: any) {
    console.log('open_code: ', open_code);
    let data = {
      opt: 'DelAgendaTopic',
      agendatopic_code: agendatopic_code,
      agendatopic_doc: agendatopic_doc
    };

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
        this.http.post(environment.baseUrl + '/_agenda_topic_remove.php', data).subscribe(
          (response: any) => {
            console.log('response: ', response);
            if (response.status == 'Ok') {
              this.fetchAgendaTopic(open_code);

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
    });
  }

  // del file doc
  delFile(item:any, index:any) {
    let data = {
      action: 'removeFile',
      opt: 'topicDocFile',
      doc_code: item.topicdoc_code,
      doc_path: item.topicdoc_path,
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
                this.topic.doc_files.splice(index, 1);

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

   // data file document
   onClickOpenFile(item:any) {
    this.datafiles = item;
  }

  // edit 
  onClickUpdate(data: any) {
    console.log('topic update:', data);
    this.topic = data;
    this.topic.agendatopic_prarent = data.agendatopic_code; //หัวข้อวาระย่อยของ ?
    this.topic.action_submit = 'Update'; // Update ข้อมูล
  }

  openWindowWithUrl(url: string): void {
    //const sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //console.log(sanitizedUrl);
    window.open(url, '_blank');
    //window.open(sanitizedUrl.toString(), '_blank');

  }

  async openAnyFile(file_path: any) {
    let path = environment.vieFile + file_path;
    console.log(path);
    this.openWindowWithUrl(path); 
  }

  defaultForm() {
    this.topicForm.reset();
    this.topic.action_submit = 'Insert';
    this.topic.doc_files = [];
    this.selectedFiles = [];
    this.fetchAgendaTopic(this.meeting.open_code);
  }

}
