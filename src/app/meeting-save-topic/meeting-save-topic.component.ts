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
  selector: 'app-meeting-save-topic',
  templateUrl: './meeting-save-topic.component.html',
  styleUrls: ['./meeting-save-topic.component.css']
})
export class MeetingSaveTopicComponent {
  outsiderForm!: FormGroup;
  topicForm!: FormGroup;

  user: any = {};

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

  //meeting agenda
  topic: any = {
    action_submit: 'Insert'
  };

  //confirm
  topic_confirm: any = {};

  selectedFiles: File[] = [];
  meeting_list: any;
  mttopic_list: any;
  user_id: any;
  meeting_code: any;
  fac_code: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {

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

    this.user.action_submit = 'Insert';
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    this.open_code = this.route.snapshot.paramMap.get('open_code');
    this.open_title = this.route.snapshot.paramMap.get('open_title');

    this.fetchTopicMeeting();
    this.getUser();
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    this.user_id = this.userData.user_id;
    this.fac_code = this.userData.faculty_code;
    console.log('user:, ', this.user_id);
  }

  // ระเบียบวาระ
  fetchTopicMeeting() {
    var data = {
      "opt": "veiwAgendaManage",
      "open_code": this.open_code,
      "meeting_code": this.meeting_code,
    }
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_view_data.php', data).subscribe(
      (res: any) => {
        console.log('mttopic_list: ', res);
        this.mttopic_list = res.data;
      },
      (error) => {
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
    let path = environment.baseUrlUpload + file_path;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

  // Agenda topic.

  onClickCheckTopic(item: any) {
    this.topic = item;
    console.log(this.topic);
  }

  confirmCheckAgendaTopic(item: any, confirm_status:any) {
    
    // var data = {
    //   "opt":"confirmAgendaTopic",
    //   "agendatopic_code": agendatopic_code,
    //   "confirm_status":confirm_status
    // }

    this.topic_confirm = item;
    this.topic_confirm.confirm_status = confirm_status;
    this.topic_confirm.opt = "confirmAgendaTopic";

    console.log('topic_confirm', this.topic_confirm);
    this.http.post(environment.baseUrl + '/_agenda_manage_confirm.php', this.topic_confirm).subscribe(
      (response: any) => {
        console.log('response: ', response);
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

  //สร้างไฟล์ระเบียบวาระ pdf
  createAgenda(meeting_code: any) {
    var data = {
      "opt": "createPdfAgendaTopic",
      "meeting_code": this.meeting_code,
    }
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/pdf/_create_agenda_topic.php', data).subscribe(
      (res: any) => {
        console.log('mttopic_list: ', res);
        this.mttopic_list = res.data;
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

   // view file
   async createFilePdfAgenda(meeting_code: any) {
    let path = environment.pdfUrl + '/_create_agenda_topic.php?meeting_code=' + meeting_code;
    //console.log(path);
    this.openWindowWithUrl(path);
  }

   // Agenda topic.
   onClickAddTopic(item: any, agendatopic_code:any) {
    console.log('topic: ', item);
    this.topic.topic_code = item.topic_code;
    this.topic.agendatopic_prarent = agendatopic_code; //หัวข้อวาระย่อยของ ?
    this.topic.action_submit = 'Insert';
  }

  saveAgendaTopic(item: any) {
    this.topic = item;

    console.log('save meeting', this.topic);
    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('agendatopic_doc[]', this.selectedFiles[i]);
    }

    formData.append('user_id', this.user_id);
    formData.append('meeting_code', this.meeting_code);
    formData.append('faculty_code', this.fac_code);
    formData.append('topic_code', this.topic.topic_code);
    formData.append('agendatopic_prarent', this.topic.agendatopic_prarent);
    formData.append('agendatopic_no', this.topic.agendatopic_no);
    formData.append('agendatopic_name', this.topic.agendatopic_name);
    formData.append('agendatopic_origin', this.topic.agendatopic_origin);
    formData.append('agendatopic_offer', this.topic.agendatopic_offer);
    formData.append('agendatopic_code', this.topic.agendatopic_code);
    formData.append('action_submit', this.topic.action_submit);

    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_agenda_topic_save.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.fetchTopicMeeting();
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

}
