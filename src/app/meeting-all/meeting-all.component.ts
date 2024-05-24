import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-meeting-all',
  templateUrl: './meeting-all.component.html',
  styleUrls: ['./meeting-all.component.css']
})
export class MeetingAllComponent {
  userData: any;
  fac_code: any;
  user_id: any;
  user_fname: any;
  user_lname: any;
  agency_list: any;
  fac_name: any;
  citizen_id: any;
  meeting_list: any;
  user_role: any;
  counts: any = {};
  fetchMeetingData: any;
  constructor(
    private http: HttpClient,
    
  ) {
    
  }

  ngOnInit(): void {
    this.getUser();
    this.fetchMeeting(this.citizen_id);
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    //console.log('user:, ', this.userData);
    this.fac_code = this.userData.faculty_code;
    this.fac_name = this.userData.faculty_name;
    this.user_id = this.userData.user_id;
    this.user_fname = this.userData.user_fname;
    this.user_lname = this.userData.user_lname;
    this.citizen_id = this.userData.cid;
    this.user_role = this.userData.user_role; //สิทธิ์การใช้งาน

  }

  // การประชุมทั้งหมด
  fetchMeeting(person_id: string): void {
    var data = {
      "opt": "viewMeetingUserAll",
      "person_id": person_id
    }
    this.http.post(environment.baseUrl + '/_view_data.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('meeting all:  ', res); // เเสดงค่าใน console
          this.fetchMeetingData = res.data;
        }
      });
  }
}
