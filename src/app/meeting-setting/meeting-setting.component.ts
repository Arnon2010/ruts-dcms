import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meeting-setting',
  templateUrl: './meeting-setting.component.html',
  styleUrls: ['./meeting-setting.component.css']
})
export class MeetingSettingComponent {
  regisForm!: FormGroup;

  user: regisUser = {
    user_id: 0,
    user_epassport: '',
    user_fname: '',
    user_lname: '',
    user_role: '',
    faculty_code: '',
    action_submit: 'Insert',
  }

  p: number = 1;
  collection: any = [];
  FAClist: any;
  users: any[] = [];
  filteredItems: any[] = [];
  userData: any;
  searchText: any;
  total_row: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
  ) {

    this.regisForm = this.fb.group({
      user_epassport: ['', Validators.required],
      user_fname: ['', Validators.required],
      user_lname: ['', Validators.required],
      user_role: ['', Validators.required],
      faculty_code: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFac();
    this.fetchDataUser();
  }

  onSearch() {
    this.filteredItems = this.users.filter((item:any) => {
      //console.log('item: ',item);
      //return item.user_fname.toLowerCase().includes(this.searchText.toLowerCase());
      return (
        item.user_fname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.user_lname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.user_epassport.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.role_status.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  getUserData(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    //console.log('userdata:, ', this.userData); //เเสดงค่า studentData ใน console
  }

  getFac(): void {
    var data = {
      opt: 'viewTable',
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

  fetchDataUser() {
    this.http
      .get(environment.baseUrl + '/_user_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.users = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
        //console.log('Users: ', this.users)
      });
  }

  // Add and Update User.
  saveUser(item:any) {
    this.user = item;
    console.log('test adduser', this.user);
    this.http.post(environment.baseUrl + '/_user_save.php', this.user).subscribe(
      (response:any) => {
        //console.log('response: ', response);
        if(response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            // get users
            this.fetchDataUser();
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

  // edit user
  onClickEditUser(data:any) {
    this.user = data;
    this.user.user_id = data.user_id; // id user
    this.user.action_submit = 'Update'; // Update ข้อมูล
  }
}

export interface regisUser {
  user_id: Number;
  user_epassport: String;
  user_fname: String;
  user_lname: String;
  user_role: String;
  faculty_code: String;
  action_submit: String; // Add or Update
}

