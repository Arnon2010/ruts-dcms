import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agency-topic',
  templateUrl: './agency-topic.component.html',
  styleUrls: ['./agency-topic.component.css']
})
export class AgencyTopicComponent {
  outsiderForm!: FormGroup;
  topicForm!: FormGroup;

  meeting: any = {};
  userData: any;
  open_code: any;
  open_title: any;

  //meeting
  topic: any = {
    action_submit: 'Insert'
  };

  selectedFiles: File[] = [];
  meeting_list: any;
  mttopic_list: any;
  user_id: any;
  agency_code: any;
  meeting_code: any;
  agendatopic_list: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute
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

    this.agency_code = this.route.snapshot.paramMap.get('id');
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    //this.open_title = this.route.snapshot.paramMap.get('title');

    this.fetchMeeting(this.meeting_code);
    this.getUser();
  }


  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    this.user_id = this.userData.user_id;
    console.log('user:, ', this.user_id);
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
      "agency_code": this.agency_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('agendatopic_list: ', res);
        this.agendatopic_list = res.data;
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

  // Agenda topic.

  onClickAddTopic(item:any) {
    this.topic.topic_code = item;
  }

  saveAgendaTopic(item: any) {
    this.topic = item;

    console.log('save meeting', this.topic);
    // Create form data for file upload
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('agendatopic_code[]', this.selectedFiles[i]);
    }

    formData.append('user_id', this.user_id);
    formData.append('meeting_code', this.meeting_code);
    formData.append('agency_code', this.agency_code); 
    formData.append('topic_code', this.topic.topic_code);
    formData.append('agendatopic_prarent', this.topic.agendatopic_prarent);
    formData.append('agendatopic_no', this.topic.agendatopic_no);
    formData.append('agendatopic_name', this.topic.agendatopic_name);
    formData.append('agendatopic_origin', this.topic.agendatopic_origin);
    formData.append('agendatopic_offer', this.topic.agendatopic_offer);
    formData.append('foreman_code', this.topic.foreman_code);
    formData.append('action_submit', this.topic.action_submit);

    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_agenda_topic_add.php', formData).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            this.fetchAgendaTopic(this.meeting.open_code);
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
