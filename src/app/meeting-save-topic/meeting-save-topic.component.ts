import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {EditorConfig, ST_BUTTONS} from 'ngx-simple-text-editor';


@Component({
  selector: 'app-meeting-save-topic',
  templateUrl: './meeting-save-topic.component.html',
  styleUrls: ['./meeting-save-topic.component.css']
})
export class MeetingSaveTopicComponent {

  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,
  };

  recordForm!: FormGroup;
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


  //confirm
  topic_confirm: any = {};

  selectedFiles: File[] = [];
  meeting_list: any;
  mttopic_list: any;
  user_id: any;
  meeting_code: any;
  fac_code: any;
  meeting: any = {};

  meeting_endtime:any;

  agenda: any = {
    agenda_assigned: '',
    agenda_discussion: '',
    agenda_resolution: '',
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {

    this.recordForm = this.fb.group({
      agenda_resolution: ['', Validators.nullValidator],
      agenda_discussion: ['', Validators.nullValidator],
      agenda_assigned: ['', Validators.nullValidator],
    });
  }

  ngOnInit(): void {

    this.user.action_submit = 'Insert';
    this.meeting_code = this.route.snapshot.paramMap.get('meeting_code');
    this.getUser();
    this.getMeetingData(this.meeting_code);
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    this.user_id = this.userData.user_id;
    this.fac_code = this.userData.faculty_code;
    //console.log('user:, ', this.user_id);
  }

  getMeetingData(meeting_code:any) {
    var data = {
      "opt": "viewMeetingData",
      "meeting_code": meeting_code,
    }
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_view_data.php', data).subscribe(
      (res: any) => {
        console.log('meeting data: ',res);
        this.meeting = res.data;
        //console.log(this.meeting);
        this.fetchTopicMeeting(this.meeting.open_code);
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

  // ระเบียบวาระ
  fetchTopicMeeting(open_code:any) {
    var data = {
      "opt": "veiwAgendaManage",
      "open_code": open_code,
      "meeting_code": this.meeting_code,
    }
    //console.log('save formData', formData);
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

  confirmCheckAgendaTopic(item: any, confirm_status:any) {
    this.topic_confirm = item;
    this.topic_confirm.confirm_status = confirm_status;
    this.topic_confirm.opt = "confirmAgendaTopic";
    //console.log('topic_confirm', this.topic_confirm);
    this.http.post(environment.baseUrl + '/_agenda_manage_confirm.php', this.topic_confirm).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            //this.fetchTopicMeeting();
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

  confirmOpenMeeting(meeting_code: any) {
   // console.log('confirm meeting open :', meeting_code);
    var data = {
      "opt": "confirmSave",
      "meeting_code": meeting_code,
    }
    //console.log('save formData', data);
    this.http.post(environment.baseUrl + '/_agenda_topic_save_confirm.php', data).subscribe(
      (res: any) => {
        //console.log(': ', res);
        this.getMeetingData(meeting_code);
      },
      (error) => {
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
        //console.log('mttopic_list: ', res);
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

  noteAgendaTopic_old(item:any) {
    var data = {
      "action_submit": "Update",
      "agendatopic_code": item.agendatopic_code,
      "agendatopic_note": item.agendatopic_note,
    }
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_agenda_topic_note.php', data).subscribe(
      (res: any) => {
        //console.log('topic_note: ', res);
        this.recordForm.reset();
        //this.mttopic_list = res.data;
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

  // Agenda topic.
  onClickTopic(item: any) {
    this.agenda.agendatopic_code = item.agendatopic_code;
    this.agenda.agendatopic_name = item.agendatopic_name;
    this.agenda.agendatopic_no = item.agendatopic_no;
    var data = {
      "opt": "agendaRecord",
      "agendatopic_code": item.agendatopic_code,
    }
    this.http.post(environment.baseUrl + '/_agenda_record_data.php', data).subscribe(
      (res: any) => {
        //console.log(': ', res);
        var item = res.data[0];

        if(res.row == '1') {
          this.agenda.action_submit = 'Update';
          this.agenda.agenda_resolution = item.agenda_resolution;
          this.agenda.agenda_discussion = item.agenda_discussion;
          this.agenda.agenda_assigned = item.agenda_assigned;

        } else {
          this.agenda.action_submit = 'Insert';
          this.agenda.agenda_resolution = '';
          this.agenda.agenda_discussion = '';
          this.agenda.agenda_assigned = '';
        }
        //console.log(this.agenda);
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

  // บันทึก record
  recordAgendaTopic(item:any) {
    var data = {
      "opt": "recordTopic",
      "agendatopic_code": item.agendatopic_code,
      "agenda_resolution": item.agenda_resolution,
      "agenda_discussion": item.agenda_discussion,
      "agenda_assigned": item.agenda_assigned,
      "action_submit": item.action_submit,
    }
    //console.log('save formData', data);
    this.http.post(environment.baseUrl + '/_agenda_record_save.php', data).subscribe(
      (res: any) => {
        //console.log('topic_note: ', res);
        this.fetchTopicMeeting(this.meeting.open_code);
      },
      (error) => {
        console.log('Error adduser: ', error);
      }
    );
  }

  // เลิกประชุม
  endMeetingTime(meeting_code:any) {
    var data = {
      "action": "endMeeting",
      "meeting_code": meeting_code,
      "meeting_endtime": this.meeting_endtime,
      "user_id": this.user_id
    }
    //console.log('save formData', formData);
    this.http.post(environment.baseUrl + '/_meeting_endtime.php', data).subscribe(
      (res: any) => {
        if (res.status == 'Ok') {
          // Swal.fire('บันทึกเวลาเลิกประชุมสำเร็จ', '', 'success').then(() => {
          //   //this.fetchTopicMeeting();
          // })
          Swal.fire({
            title: 'บันทึกเวลาเลิกประชุมสำเร็จ',
            text: 'คุณต้องการที่จะกลับไปหน้าหลักหรือไม่?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'กลับหน้าหลัก',
            cancelButtonText: 'ไม่'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['home'], {}); // ผู้ดูแลระบบ
            }
          });
        }

      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

}
