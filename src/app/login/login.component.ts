import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {    //กำหนดฟอร์ม frmLogin โดยใช้ FormBuilder ซึ่งประกอบด้วยสองฟิลด์คือ std_id และ std_password 
  frmLogin = this.formBuilder.group({             // โดยต้องมีการระบุ Validators ที่บังคับให้กรอกข้อมูลเสมอ
    std_id: ['', Validators.required],
    std_password: ['', Validators.required]
  });
  user_epass: any;
  user_password: string | null | undefined;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: ApiService,
  ) { }

  ngOnInit(): void { }

  login(): void {
    console.log(this.frmLogin.value);
    this.user_epass = this.frmLogin.value.std_id;
    this.user_password = this.frmLogin.value.std_password;
    this.dataService.eloginUser(this.user_epass, this.user_password , 'https://api.rmutsv.ac.th/elogin')
      .subscribe((res: any) => {
        if (res.status == "ok") {
          console.log('user login', res); // เเสดงค่าใน console
          const splitArray:string[] = this.user_epass.split("s");
          let stdId = splitArray[1];
          //console.log(stdId);
          // student data from สวท.
          this.getStudentDataSis(stdId);
           
        } else {
          Swal.fire('เข้าสู่ระบบไม่สำเร็จ ! ', '', 'error').then(() => {
            //this.frmLogin.reset();
          });
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
