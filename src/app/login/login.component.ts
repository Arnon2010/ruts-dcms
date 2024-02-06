import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home-student',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {    
  @ViewChild('sideMenu') sideMenu: ElementRef;
  // กำหนดฟอร์ม frmLogin โดยใช้ FormBuilder ซึ่งประกอบด้วยสองฟิลด์คือ std_id และ std_password 
  // โดยต้องมีการระบุ Validators ที่บังคับให้กรอกข้อมูลเสมอ
  title = 'RUTS Digital Conference Management System';
  frmLogin = this.formBuilder.group({             
    user_epassport: ['arnn.l', Validators.required],
    user_password: ['arnonrmutsv', Validators.required]
  });
  user_epass: any;
  user_password: string | null | undefined;

  isLogin: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: ApiService,
  ) { 
   
    // กำหนดค่าเริ่มต้นให้ sideMenu เป็น ElementRef
    this.sideMenu = {} as ElementRef;

    
    //console.log(this.isLogin);
  }

  ngOnInit(): void {
    this.isLogin = this.dataService.isLoggedIn();
    // if (!this.isLogin) {
    //   this.hideSideMenu();
    //   //this.sideMenu.nativeElement.style.display = 'none';
    // }
   }

   hideSideMenu() {
    // ซ่อน sidemenu โดยใช้ ViewChild
    console.log('ซ่อน sidemenu โดยใช้ ViewChild');
    this.sideMenu.nativeElement.style.display = 'none';
    
  }

  login() {
    this.http.post(environment.baseUrl + '/login_user.php', this.frmLogin.value).subscribe({ //ส่งค่าจาก Form ไป ตรวจสอบกับ API Login ติดต่อไปยัง Api login.php
      next: (data: any) => {
        console.log('user: ', data); // เเสดงค่าใน consolen 
        if (data.status == 'ok') {  //หากเข้าสู่ระบบสำเร็จ
          //this.getStudentData(res['std_id']); //รับค่า จำก std_id
          // elogin
          this.user_epass = this.frmLogin.value.user_epassport;
          this.user_password = this.frmLogin.value.user_password;
          this.dataService.eloginUser(this.user_epass, this.user_password, 'https://api.rmutsv.ac.th/elogin')
            .subscribe((res: any) => {
              //console.log(res.token);
              //if (res.status == "ok") {
                localStorage.setItem('Token', JSON.stringify(data.row)); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token 
                if (data.row.user_role == 'F') {
                  this.router.navigate(['home'], {}); // คณะ/วิทยาลัย
                } else if (data.row.user_role == 'A') {
                  
                  this.router.navigate(['admin'], {}); // ผู้ดูแลระบบ
                  //window.location.reload();
                 
                } else {
                  this.router.navigate(['user'], {}); // ผู้ใช้งาน
                }
              // } else {
              //   Swal.fire('เข้าสู่ระบบไม่สำเร็จ', '', 'error').then(() => {
              //     //this.frmAdminLogin.reset();
              //   });
              // }
            });
        } else {
          Swal.fire('ไม่มีสิทธิการเข้าใช้ระบบ กรุณาติดต่อกองพัฒนานักศึกษา !', '', 'error').then(() => {
            //this.frmAdminLogin.reset();
          });
        }
      }
    });
  }

  getStudentDataSis(std_id:any): void {
    var data = {
      opt: 'sport',
      studentid: std_id
    }
    this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
    .subscribe({ 
      next: (res: any) => {
        console.log('std data sis: ',res);
        //this.updateFacultyId(res.data[0].facultyname, std_id);
        localStorage.setItem('Token', JSON.stringify(res.data[0])); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token 
         // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
         //const { std_prefix, std_name, std_lastname, std_phone, std_email } = res;
         const { std_prefix, std_name, std_lastname, std_phone, std_email } = res;
         //this.router.navigate(['homestudent'], { queryParams: { id: '123' } });
         this.router.navigate(['homestudent']);
      
      }
    });
  }

  getStudentData(studentId: string): void {
    this.http
      .get(`http://localhost/studycheck/Api/studentdata.php?std_id=${studentId}`) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => {
        // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        const { std_prefix, std_name, std_lastname, std_phone, std_email } = res;
        this.router.navigate(['homestudent'], { // ส่งข้อมูลไปยังหน้า home-student
          state: {
            std_prefix,
            std_name,
            std_lastname,
            std_phone,
            std_email
          }
        });
      });
  }

  updateFacultyId(fac_name: string, std_id: any) {
      this.http.get(environment.baseUrl + '/updateFacultyId.php?fac_name=' + fac_name + '&std_id=' + std_id).subscribe((res:any)=>{
        return res;
      });
  }
}
