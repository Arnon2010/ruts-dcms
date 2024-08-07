import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meeting-manage',
  templateUrl: './meeting-manage.component.html',
  styleUrls: ['./meeting-manage.component.css']
})
export class MeetingManageComponent {
  outsiderForm!: FormGroup;

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
  fac_code: any;
  user_id: any;
  user_fname: any;
  user_lname: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute
  ) {

    this.outsiderForm = this.fb.group({
      prefix_name: ['', Validators.required],
      outsider_fname: ['', Validators.required],
      outsider_lname: ['', Validators.required],
      outsider_position: ['', Validators.required],
      outsider_agency: ['', Validators.required],
      outsider_email: ['', Validators.required],
      outsider_phone: ['', Validators.required],
      outsider_username: ['', Validators.required],
      outsider_password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getPrefix();
    this.user.action_submit = 'Insert';
    this.open_code = this.route.snapshot.paramMap.get('id');
    this.fetchOpenMeeting(this.fac_code);
  }

  onSearch() {
    this.filteredItems = this.users.filter((item: any) => {
      //console.log('item: ',item);
      //return item.user_fname.toLowerCase().includes(this.searchText.toLowerCase());
      return (
        item.outsider_fname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_lname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_username.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_agency.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_agency.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.outsider_phone.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    //console.log('user:, ', this.userData);
    this.fac_code = this.userData.faculty_code;
    this.user_id = this.userData.user_id;
    this.user_fname = this.userData.user_fname;
    this.user_lname = this.userData.user_lname;
  }

  getPrefix(): void {
    var data = {
      "opt": 'viewTable',
      "Table": "REF_PREFIX"
    }
    // this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
    //   .subscribe({
    //     next: (res: any) => {
    //       //console.log('REF_PREFIX ', res); // เเสดงค่าใน console
    //       this.prefix_list = res;
    //     }
    //   });
    this.http.post(environment.baseUrl + '/_curl_acc3d_person.php', data)
      .subscribe({
        next: (res: any) => {
          this.prefix_list = res;
        }
      });
  }

  fetchOpenMeeting(fac_code:any) {
    this.http
      .get(environment.baseUrl + '/_meetingopen_data.php?faculty_code=' + fac_code) //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.meetings = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
      });
  }


  fetchDataOutsider() {
    this.http
      .get(environment.baseUrl + '/_outsider_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.users = res.data;
        this.filteredItems = res.data;
        this.total_row = res.row;
        console.log('Users: ', this.users)
      });
  }

  // Add and Update User.
  saveOutsider(item: any) {
    this.user = item;
    //console.log('test adduser', this.user);
    this.http.post(environment.baseUrl + '/_outsider_add.php', this.user).subscribe(
      (response: any) => {
        //console.log('response: ', response);
        if (response.status == 'Ok') {
          Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
            // get users
            this.fetchDataOutsider();
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

  // delete ผู้เข้าร่วมประชุม
  delOutsider(item: any) {
    let data = {
      "id": item.outsider_code,
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
        this.http.post(environment.baseUrl + '/_outsider_remove.php', data).subscribe(
          (res: any) => {
            //console.log(response);
            if (res.status == 'Ok') {
              Swal.fire('ลบข้อมูลเรียบร้อย!', '', 'success').then(() => {
                this.fetchDataOutsider();
              })
            }
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

  // edit user
  onClickEditUser(data: any) {
    this.user = data;
    this.user.outsider_code = data.outsider_code; // id user
    this.user.action_submit = 'Update'; // Update ข้อมูล
  }
}
