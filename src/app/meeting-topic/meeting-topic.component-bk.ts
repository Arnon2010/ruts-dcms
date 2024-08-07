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
  selector: 'app-meeting-topic',
  templateUrl: './meeting-topic.component.html',
  styleUrls: ['./meeting-topic.component.css']
})
export class MeetingTopicComponent {

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
  topics: any = {};
  topic_doc_file: any;
  fileCountTopic: any;
  topic_notes: any;


  note: any = {
    action_submit: 'Insert',
  };

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
    this.fetchAgendaTopicUser();
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
      "meeting_code": meeting_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('meeting data--->: ', res); // เเสดงค่าใน console
          this.meeting = res.data;
          this.open_title = this.meeting.open_title;
          this.open_code = this.meeting.open_code;

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
  fetchAgendaTopicUser(): void {
    var data = {
      "opt": "viewAgendaTopicUser",
      "open_code": this.open_code,
      "meeting_code": this.meeting_code,
      "cid": this.cid,
    }

    console.log('view agenda topic user: ', data);
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('agendatopic_list: ', res);
          this.agendatopic_list = res.data;
          this.person = res.data_person[0];
          this.person_position = res.data_person;
          //console.log(this.person_position);
        }
      });
  }

  //ยืนยันเข้าร่วมประชุม
  confirmMeeting(confirm_status: any, person_type: any) {
    var data = {
      "opt": "ConfirmMeeting",
      "cid": this.cid,
      "meeting_code": this.meeting_code,
      "person_type": person_type,
      "confirm_status": confirm_status
    }
    this.http.post(environment.baseUrl + '/_person_meeting_confirm.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('confirm: ', res);
          this.person.person_rstatus = confirm_status;
          //this.agendatopic_list = res.data;
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

  onClickModalTopic(agendatopic_code: any, topic_note:string) {

    this.note.agendatopic_code = agendatopic_code;

    var data = {
      "opt": "viewTopicDetail",
      "agendatopic_code": agendatopic_code,
    }

    console.log('viewTopicDetail:', data);

    //this.fetchTopicNote(agendatopic_code, this.person.person_code);

    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          
          this.topics = res;
          console.log('topics: ', this.topics);
          //this.topics.topic_note = topic_note;
          this.fileCountTopic = res.data[0].doc_files.length;
        }
      });
  }

  saveNoteTopic(person_code:any) {
    console.log(this.note);
    var data = {
      "opt": this.note.action_submit,
      "agendatopic_code": this.note.agendatopic_code,
      "topic_note": this.note.topic_note,
      "topicnote_code": this.note.topicnote_code,
      "person_code": person_code,
    }
    console.log('Topic save note:', data);
    this.http.post(environment.baseUrl + '/_meeting_topic_note.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('topic data: ', res);
          this.fetchAgendaTopicUser();
          this.fetchTopicNote(this.note.agendatopic_code, person_code);
          this.note.topic_note = '';
          this.note.action_submit = 'Insert';

        }
      });
  }

  
  // Note ของผู้เข้าร่วมประชุม
  fetchTopicNote(agendatopic_code:any, person_code:any): void {
    var data = {
      "opt": "viewTopicNote",
      "agendatopic_code": agendatopic_code,
      "person_code": person_code
    }

    console.log('fetchTopicNote ',data);
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('note person: ', res);
          this.topic_notes = res;
        }
      });
  }

  editTopic(item:any) {
    this.note.action_submit = 'Update';
    this.note.topic_note = item.topicnote_note;
    this.note.topicnote_code = item.topicnote_code;

    console.log(this.note);
  }

  delTopic(item:any) {
    var data = {
      "action": "delete",
      "id": item.topicnote_code,
    }
    this.http.post(environment.baseUrl + '/_meeting_topic_note_remove.php', data)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if(res.status == 'Ok') {
            this.fetchTopicNote(item.agendatopic_code, item.person_code);
          }
        }
      });
  }
  
}

