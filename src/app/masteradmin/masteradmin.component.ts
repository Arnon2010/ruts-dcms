import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot, faUserPlus, faList, faPenToSquare, faGear, faUserXmark, faUserEdit, faWrench } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-masteradmin',
  templateUrl: './masteradmin.component.html',
  styleUrls: ['./masteradmin.component.css']
})
export class MasteradminComponent implements OnInit {
  regisForm!: FormGroup;

  faUserPlus = faUserPlus;
  faList = faList;
  faPenToSquare = faPenToSquare;
  faUserXmark = faUserXmark;
  faUserEdit = faUserEdit;
  faGear = faGear;
  faWrench = faWrench;

  user_email: any;
  user_password: any;
  user_name: any;
  user_lastname: any;
  user_role: any;
  fac_id: any;
  userData: any;
  userlist: any;
  cap_type_name : any;

  userFname: any;
  userLname: any;
  userFacName: any;

  majorCapData: any = [];
  

  regis: regisUser = {
    user_id: 0,
    user_email: '',
    user_password: '',
    user_name: '',
    user_lastname: '',
    user_role: '',
    fac_id: 0,
  }
  FAClist: any;
  mapFacId: any;
  capListFacReport: any;
  capListTypeReport: any; 
  capTotalReport: any;
  cap_total: any;
  total_cap_all: any;
  total_cap_y: any;
  total_cap_w: any;
  total_cap_n: any;

  constructor(private http: HttpClient, private location: Location,private fb: FormBuilder,) {
    this.regisForm = this.fb.group({
      user_email: ['', Validators.required],
      user_password: ['', Validators.required],
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_role: ['', Validators.required],
      fac_id: ['', Validators.required],

    });

    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log(this.userData); //เเสดงค่า studentData ใน console
    this.mapFacId = this.userData.map_fac_id;
    this.userFname = this.userData.user_name;
    this.userLname = this.userData.user_lastname;
    this.userFacName = this.userData.fac_name;
  }

  ngOnInit(): void {
    this.getUserData();
    this.getuserlist();

    // faculty
    this.getFac();
    this. getFaculty();

    //รายงานภาพรวมของสมรรถนะ
    this.reportCapType();

    //รายงานภาพรวมของสมรรถนะของคณะ
    this.reportCapFac();

    //จำนวนการส่งหลักฐานสมรรถนะ
    this.reportCapTotal();

  }

  //รายงานภาพรวมของสมรรถนะแยกตามด้านต่าง ๆ
  reportCapType(): void {
    var data = {
      year_report: ''
    }
    this.http.post(environment.baseUrl + '/report_cap_type.php', data)
    .subscribe({ 
      next: (res: any) => {
        this.capListTypeReport = res.data;
        console.log('cap type ',res); // เเสดงค่าใน console
      }
    });
  }

  //รายงานภาพรวมของสมรรถนะแยกตามคณะ
  reportCapTotal(): void {
    var data = {
      year_report: ''
    }
    this.http.post(environment.baseUrl + '/report_cap_total.php', data)
    .subscribe({ 
      next: (res: any) => {
        this.capTotalReport = res.data[0];
        this.total_cap_all = this.capTotalReport.total_cap; //จำนวนยื่นทั้งหมด
        this.total_cap_y = this.capTotalReport.status_y; //จำนวนผ่านแล้ว
        this.total_cap_w = this.capTotalReport.status_w; //จำนวนรออนุมัติ
        this.total_cap_n = this.capTotalReport.status_n; // จำนวนไม่ผ่านอนุมัติ
        console.log('cap total ',res); // เเสดงค่าใน console
      }
    });
  }
  
  //รายงานภาพรวมของสมรรถนะแยกตามคณะ
  reportCapFac(): void {
    var data = {
      year_report: ''
    }
    this.http.post(environment.baseUrl + '/report_cap_fac.php', data)
    .subscribe({ 
      next: (res: any) => {
        this.capListFacReport = res.data;
        console.log('cap fac ',res); // เเสดงค่าใน console
      }
    });
  }

  getMejorCapData(fac_id: string): void {
    var data = {
      opt: 'count_std',
      fac_id: fac_id
    }

    console.log(data);
    this.http.post(environment.baseUrl + '/datacapmajor.php', data)
      .subscribe({
        next: (res: any) => {
          this.majorCapData = res.data;
          console.log('majorCapData ', res); // เเสดงค่าใน console
        }
      });
  }

  getFaculty(): void {
    var data = {
      opt: 'list_faculty'
    }
    this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
    .subscribe({ 
      next: (res: any) => {
        console.log('Faculty ',res); // เเสดงค่าใน console
      }
    });
  }

  getFac() {
    this.http
      .get(environment.baseUrl + '/getfaculty.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        this.FAClist = res;
        console.log('FAClist: ', this.FAClist)

      });
  }

  getUserData(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log('userdata:, ', this.userData); //เเสดงค่า studentData ใน console
  }

  defaultForm() {
    this.user_email = '';
    this.user_password = '';
    this.user_name = '';
    this.user_lastname = '';
    this.user_role = '';
    this.fac_id = '';
  }

  adduser() {
    const formUserData = new FormData();

    formUserData.append('user_email', this.user_email);
    formUserData.append('user_password', 'Auth');
    formUserData.append('user_name', this.user_name);
    formUserData.append('user_lastname', this.user_lastname);
    formUserData.append('user_role', this.user_role);
    formUserData.append('fac_id', this.fac_id);

    //console.log('test adduser', formUserData);

    this.http.post(environment.baseUrl + '/adduser.php', formUserData).subscribe(
      (response) => {
        Swal.fire('เพิ่มผู้ใช้สำเร็จ', '', 'success').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
          //this.regisForm.reset();
          this.getuserlist(); // รีโหลดข้อมูลใหม่
          this.defaultForm();
        })
        //console.log('adduser successfully');
        //console.log(response); // แสดงข้อมูลที่ส่งกลับมาจาก API
      },
      (error) => {
        Swal.fire('เพิ่มผู้ใช้ไม่สำเร็จ', '', 'error').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        //console.log('Error adduser');

      }
    );

  }

  editUser(data: any) {
    this.regis = data;
    //console.log('regis: ', this.regis);
    this.http.post(environment.baseUrl + '/edituser.php', this.regis).subscribe(
      (response) => {
        Swal.fire('บันทึกผู้ใช้สำเร็จ', '', 'success').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
          this.getuserlist(); // รีโหลดข้อมูลใหม่
        })
        //console.log('edit user successfully');
        //console.log(response); // แสดงข้อมูลที่ส่งกลับมาจาก API
      },
      (error) => {
        Swal.fire('บันทึกผู้ใช้ไม่สำเร็จ', '', 'error').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        //console.log('Error edituser');

      }
    );

  }

  confirmDelUser(item:any) {
    console.log('user id: ', item);
    this.regis = item;

    Swal.fire({
      title: 'คุณต้องการลบข้อมูลผู้ใช้งานท่านนี้ใช่หรือไม่ ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      denyButtonText: `ไม่ใช่`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        //Swal.fire('ลบข้อมูลสำเร็จ!', '', 'success')

        this.http.post(environment.baseUrl + '/deluser.php', this.regis).subscribe(
          (response) => {
            console.log(response);
            Swal.fire('ลบข้อมูลสำเร็จ!', '', 'success').then(() => {
              this.getuserlist(); // รีโหลดข้อมูลใหม่
            })
          },
          (error) => {
            Swal.fire('ลบข้อมูลไม่สำเร็จ', '', 'error').then(() => {
              //this.reloadPage(); //ทำการรีโหลดหน้า Web
            })
            //console.log('Error edituser');

          }
        );

      } else if (result.isDenied) {
        Swal.fire('ข้อมูลจะไม่ถูกลบ', '', 'info')
      }
    })

  }

  reloadPage() {
    this.location.go(this.location.path());
    window.location.reload();
  }

  getuserlist(): void {

    this.http
      .get(environment.baseUrl + '/getdatausers.php') //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.userlist = res.data;
        console.log('userdata: ', this.userlist)

      });
  }

  editShowData(item: any) {
    console.log(item);
    this.regis = item;

    // this.user_email = item.user_email;
    // this.user_password= item.user_password;
    // this.user_name= item.user_name;
    // this.user_lastname= item.user_lastname;
    // this.user_role= item.user_role;
    // this.fac_id= item.fac_id;
  }

  addcapacityType(){
    const formCapacityType = new FormData();
    formCapacityType.append('cap_type_name' ,this.cap_type_name);

    this.http.post(environment.baseUrl + '/addcapacitytype.php', formCapacityType).subscribe(
      (response) => {
        Swal.fire('เพิ่มหมวดรายวิชาสำเร็จ', '', 'success').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        console.log('add capacity_type successfully');
        console.log(response); // แสดงข้อมูลที่ส่งกลับมาจาก API
      },
      (error) => {
        Swal.fire('เพิ่มหมวดรายวิชาไม่สำเร็จ', '', 'error').then(() => {
          //this.reloadPage(); //ทำการรีโหลดหน้า Web
        })
        console.log('Error Add capacity_type');

      }
    );


}}

export interface regisUser {
  user_id: Number;
  user_email: String;
  user_password: String;
  user_name: String;
  user_lastname: String;
  user_role: String;
  fac_id: Number;
}
