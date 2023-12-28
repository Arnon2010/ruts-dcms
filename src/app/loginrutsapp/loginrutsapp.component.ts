import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-loginrutsapp',
  templateUrl: './loginrutsapp.component.html',
  styleUrls: ['./loginrutsapp.component.css']
})
export class LoginrutsappComponent {
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: ApiService,
    private route: ActivatedRoute,
  ) { 

    //get snap url
   
    let token = this.route.snapshot.paramMap.get('token'); // รหัสนักศึกษา/epassport
    this.eLoginToken(token);
  }

  eLoginRuts(std_id:any): void {
    var data = {
      username: 'sport',
      password: std_id
    }
    this.http.post('https://api.rmutsv.ac.th/elogin', data)
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

  eLoginToken(token: any): void {
    this.http
      .get('https://api.rmutsv.ac.th/elogin/token/' + token) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => {
        if(res.status == 'ok') {
          console.log(res);
          const splitArray:string[] = res.username.split("s");
          let stdId = splitArray[1];
          this.getStudentDataSis(stdId);
          
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
        //console.log('std data sis: ',res);
        //this.updateFacultyId(res.data[0].facultyname, std_id);
        localStorage.setItem('Token', JSON.stringify(res.data[0])); //เเละเก็บค่าที่ respond ไว้ใน localStorage Key ชื่อ Token 
         // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
         this.router.navigate(['homestudent']);
      
      }
    });
  }
}
