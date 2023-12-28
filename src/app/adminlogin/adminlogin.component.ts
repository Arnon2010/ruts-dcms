import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {

  faUsers = faUsers;

  frmAdminLogin = this.formBuilder.group({
    user_email: ['', Validators.required],
    user_password: ['', Validators.required]
  });
  user_epass: any;
  user_password: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: ApiService,
  ) { }

  ngOnInit(): void { }

  adminlogin111() {
    this.http
      .post(environment.baseUrl + '/adminlogin.php', this.frmAdminLogin.value)
      .pipe(
        catchError((error) => {
          console.error(error);
          Swal.fire('การเชื่อมต่อ API ไม่สำเร็จ', '', 'error');
          return of(null); // คืนค่า null เพื่อทำให้กระบวนการต่อไปดำเนินต่อไปได้
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);

          if (res === 'Admin Login success') {
            Swal.fire('เข้าสู่ระบบสำเร็จ', '', 'success').then(() => {
              this.router.navigate(['fmanagement']);
            });
          } else if (res === 'Masteradmin Login success') {
            Swal.fire('เข้าสู่ระบบสำเร็จ', '', 'success').then(() => {
              this.router.navigate(['masteradmin']); // เปลี่ยนเส้นทางไปยังหน้า Masteradmin
            });
          } else if (res === 'Insufficient permissions') {
            Swal.fire('สิทธิ์ไม่เพียงพอ', '', 'error').then(() => {
              this.frmAdminLogin.reset();
            });
          } else {
            Swal.fire('รหัสผ่านไม่ถูกต้อง', '', 'error').then(() => {
              this.frmAdminLogin.reset();
            });
          }
        },
        error: (error) => {
          console.error(error);
          Swal.fire('การเชื่อมต่อ API ไม่สำเร็จ', '', 'error');
        }
      });
  }

  adminlogin2() {
    this.http.post(environment.baseUrl + '/adminlogin.php', this.frmAdminLogin.value).subscribe({ //ส่งค่าจาก Form ไป ตรวจสอบกับ API Login ติดต่อไปยัง Api login.php
      next: (res: any) => {
        console.log('user: ', res); // เเสดงค่าใน console

        if (res != 'Login failed') {  //หากเข้าสู่ระบบสำเร็จ
          //this.getStudentData(res['std_id']); //รับค่า จำก std_id
          localStorage.setItem('Token', JSON.stringify(res)); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token 
          if (res.user_role == 'A') {
            this.router.navigate(['fmanagement'], {}); // คณะ/วิทยาลัย
          } else {
            this.router.navigate(['masteradmin'], {}); // กองพัฒ ฯ
          }

        } else {
          Swal.fire('เข้าสู่ระบบไม่สำเร็จ', '', 'error').then(() => {
            this.frmAdminLogin.reset();
          });
        }
      }
    });
  }

  adminlogin() {
    this.http.post(environment.baseUrl + '/adminlogin.php', this.frmAdminLogin.value).subscribe({ //ส่งค่าจาก Form ไป ตรวจสอบกับ API Login ติดต่อไปยัง Api login.php
      next: (data: any) => {
        //console.log('user: ', data); // เเสดงค่าใน console

        if (data != 'Login failed') {  //หากเข้าสู่ระบบสำเร็จ
          //this.getStudentData(res['std_id']); //รับค่า จำก std_id
          // elogin
          this.user_epass = this.frmAdminLogin.value.user_email;
          this.user_password = this.frmAdminLogin.value.user_password;
          this.dataService.eloginUser(this.user_epass, this.user_password, 'https://api.rmutsv.ac.th/elogin')
            .subscribe((res: any) => {
              //console.log(res.token);
              //console.log(res);
              if (res.status == "ok") {
                localStorage.setItem('Token', JSON.stringify(data)); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token 
                if (data.user_role == 'A') {
                  this.router.navigate(['fmanagement'], {}); // คณะ/วิทยาลัย
                } else {
                  this.router.navigate(['masteradmin'], {}); // กองพัฒ ฯ
                }
              } else {
                Swal.fire('เข้าสู่ระบบไม่สำเร็จ', '', 'error').then(() => {
                  //this.frmAdminLogin.reset();
                });
              }

            });
        } else {
          Swal.fire('ไม่มีสิทธิการเข้าใช้ระบบ กรุณาติดต่อกองพัฒนานักศึกษา !', '', 'error').then(() => {
            //this.frmAdminLogin.reset();
          });
        }
      }
    });
  }

  getUserData(UserId: string): void {
    this.http
      .get(environment.baseUrl + `/studentdata.php?std_id=${UserId}`) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
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
}






