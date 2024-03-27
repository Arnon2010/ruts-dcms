import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
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
  reportData: any;

  //pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  src = 'https://mcps.rmutsv.ac.th/cert/assets/document/2567/165201020015/165201020015-20240207184347.pdf';

  //sanitizedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://e-doc.rmutsv.ac.th/document/edoc/D0026/2022/DOC180D1663832881_edoc_2022-09-22-11.pdf');

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
    this.fetchReport(this.fac_code);
    this.fetchMeetingCount(this.fac_code);
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

  // รายงาน
  fetchReport(faculty_code: string): void {
    var data = {
      "opt": "viewReport",
      "faculty_code": faculty_code
    }
    this.http.post(environment.baseUrl + '/_view_report.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('report:  ', res); // เเสดงค่าใน console
          this.reportData = res.data;
        }
      });
  }
}
