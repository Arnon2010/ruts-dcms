import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-meeting-save',
  templateUrl: './meeting-save.component.html',
  styleUrls: ['./meeting-save.component.css']
})
export class MeetingSaveComponent {
  userData: any;
  fac_code: any;
  user_id: any;
  user_fname: any;
  user_lname: any;
  agency_list: any;
  fac_name: any;
  meeting_list: any;
  filteredItems: any;
  total_row: any;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {

    this.getUser();
    this.fetchAgency(this.fac_code);
    this.fetchMeeting();

  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    console.log('user:, ', this.userData);
    this.fac_code = this.userData.faculty_code;
    this.fac_name = this.userData.faculty_name;
    this.user_id = this.userData.user_id;
    this.user_fname = this.userData.user_fname;
    this.user_lname = this.userData.user_lname;
  }

  // 
  fetchAgency(fac_code: any) {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_agency_data.php?faculty_code=' + fac_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        console.log('agency_list: ', res);
        this.agency_list = res.data;
      });
  }

  // Fetch data meeting for faculty 
  fetchMeeting() {
    var data = {
      "opt": "viewMeetingSave",
      "faculty_code": this.fac_code
    }

    this.http.post(environment.baseUrl + '/_meeting_view.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('meeting list ', res); // เเสดงค่าใน console
          this.meeting_list = res.data;
        }
      });
  }
  
}
