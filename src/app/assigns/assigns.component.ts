import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-assigns',
  templateUrl: './assigns.component.html',
  styleUrls: ['./assigns.component.css']
})
export class AssignsComponent {
  userData: any;
  fac_code: any;
  user_id: any;
  user_fname: any;
  user_lname: any;
  agency_list: any;
  fac_name: any;
  citizen_id: any;
  user_role: any;
  counts: any = {};
  total_meeting: any;
  total_meeting_pass: any;
  meeting_person: any;
  meeting_person_past: any;
  total_meeting_all: any;
  total_meeting_assigned: any;
  report_certify: any;
  num_meeting_certify: any;
  report_certify_past: any;
  num_meeting_certify_past: any;
  total_certify:any;
  num_meeting_assign: any;
  report_assigns: any;
  report_assign_past: any;
  num_meeting_assign_past: any;

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
    this.fetchMeetingUser(this.citizen_id, this.fac_code);
    this.fetchUserAssign(this.citizen_id, this.fac_code);
    this.fetchMeetingCount(this.fac_code);
    this.fetchUserAssignPast(this.citizen_id);
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    //console.log('user:, ', this.userData);
    this.fac_code = this.userData.faccode;
    this.fac_name = this.userData.facname;
    this.user_id = this.userData.user_id;
    this.user_fname = this.userData.firstname;
    this.user_lname = this.userData.lastname;
    this.citizen_id = this.userData.cid;
    this.user_role = this.userData.user_role; //สิทธิ์การใช้งาน
  }

  // จำนวนประชุมที่เกี่ยวข้อง
  fetchMeetingCount(fac_code: string): void {
    var data = {
      "opt": "viewMeetingCount",
      "fac_code": fac_code
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('meeting count:  ', res.data); // เเสดงค่าใน console
          this.counts = res.data;
        }
      });
  }

  // Consider data list คณะกรรมการพิจารณาวาระ
  fetchAgency(fac_code:any) {
    //console.log('meeting_code: ', this.meeting.meeting_code);
    this.http
      .get(environment.baseUrl + '/_agency_data.php?faculty_code=' + fac_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log( 'agency_list: ',res);
        this.agency_list = res.data;
       
      });
  }

  // ประชุมของผู้เข้าร่วม
  fetchMeetingUser(person_id: string, fac_code:any): void {
    var data = {
      "opt": "viewMeetingUser",
      "person_id": person_id,
      "fac_code": fac_code
    }
    //console.log(data);
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('meeting user:  ', res); // เเสดงค่าใน console
          this.meeting_person = res.data;
          this.meeting_person_past = res.data_past;
          this.total_meeting = res.row_meeting;
          this.total_meeting_pass = res.row_meeting_pass;
          this.total_meeting_all = res.row_meeting_all;
          this.total_meeting_assigned = res.row_assigned;
          this.total_certify = res.row_certify;

        }
      });
  }

  // รายงานการประชุม
  fetchUserAssign(person_id: string, fac_code:any): void {
    var data = {
      "opt": "viewUserAssign",
      "person_id": person_id,
      "fac_code": fac_code
    }
    this.http.post(environment.baseUrl + '/_view_user.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('data:  ', res); // เเสดงค่าใน console
          this.report_assigns = res.data; // รายงานประชุมที่รอการรับรอง
          //this.num_meeting_assign = res.row;
        }
      });
  }

  // ปิดแจ้งเตือน
  closeNotifi(person_code: string, meeting_code:any): void {
    var data = {
      "opt": "closeNotifi",
      "person_code": person_code,
      "meeting_code": meeting_code
    }
    //console.log(data);
    this.http.post(environment.baseUrl + '/_view_user.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('assign: ', res); // เเสดงค่าใน console
          this.fetchUserAssign(this.citizen_id, this.fac_code);
          this.fetchMeetingUser(this.citizen_id, this.fac_code);
          this.fetchUserAssignPast(this.citizen_id);
        }
      });
  }

  // รายงานการประชุมที่ผ่านมา
  fetchUserAssignPast(person_id: string): void {
    var data = {
      "opt": "viewUserAssignPast",
      "person_id": person_id
    }
    this.http.post(environment.baseUrl + '/_view_user.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('user assign past:  ', res); // เเสดงค่าใน console
          this.report_assign_past = res.data; // รายงานประชุมที่รับรองแล้ว
          this.num_meeting_assign_past = res.row;
        }
      });
  }
}
