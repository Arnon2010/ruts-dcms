import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  // icon
  faFilePen = faFilePen;
  faFilePdf = faFilePdf;
  faCheckToSlot = faCheckToSlot;
  userData: any;
  capData: any;
  result: any;
  mapFacId: string = '';
  majorList: any;
  majorCapData: any;
  userFname: any;
  userLname: any;
  userFacName: any;


  p: number = 1;
  collection: any = [];

  //search
  items: any[] = []; // Your data array
  filteredItems: any[] = [];
  searchText: string = '';

  approv_status: string = '0';
  num_status_w: any;
  num_status_y: any;
  num_status_n: any;
  substr: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log(this.userData); //เเสดงค่า studentData ใน console
    this.mapFacId = this.userData.map_fac_id;
    this.userFname = this.userData.user_name;
    this.userLname = this.userData.user_lastname;
    this.userFacName = this.userData.fac_name;
    this.getDataCap(this.mapFacId, 'notSelect','0');
    this.getMejorCapData(this.mapFacId);
    //this.getMejor(this.mapFacId);
   }

  ngOnInit() {
    // Initialize or fetch your data
    //this.filteredItems = this.items;
    // this.substr = "0842692074";
    // let firstCharacter = this.substr.slice(0, 1);
    // console.log(firstCharacter); // ผลลัพธ์: "H"
  }

  onSearch() {
    this.filteredItems = this.capData.filter((item:any) => {
      //console.log('item: ',item);
      return item.std_name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  getFaculty(): void {
    var data = {
      opt: 'list_faculty'
    }
    this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('Faculty ', res); // เเสดงค่าใน console
        }
      });
  }

  getMejorCapData(fac_id: string): void {
    var data = {
      opt: 'count_std',
      fac_id: fac_id
    }

    //console.log(data);
    this.http.post(environment.baseUrl + '/datacapmajor.php', data)
      .subscribe({
        next: (res: any) => {
          this.majorCapData = res.data;
          //console.log('majorCapData ', res); // เเสดงค่าใน console
        }
      });
  }

  // รายการของนักศึกษาที่ส่งหลักฐานด้านสมรรถนะ
  getDataCap(Id: string, major: string, approv_status:any): void {
    this.approv_status = approv_status;
    //console.log('approv_status: ', approv_status)
    this.http
      .get(environment.baseUrl + '/report_courses.php?map_fac_id=' + Id 
        + '&major=' + major 
        + '&approv_status=' + approv_status) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        //console.log(res);
        
        this.capData = res.data; 
        this.num_status_w = res.num_w; //จำนวนรายการรออนุมัติ
        this.num_status_y = res.num_y; //จำนวนรายการอนุมัติแล้ว
        this.num_status_n = res.num_n; //จำนวนรายการไม่อนุมัติ
        //console.log('cap data: ', this.capData)
        //search
        // Initialize or fetch your data

               
        if(res.row == 0) {
          this.filteredItems = [];
        } else {
          this.filteredItems = res.data;
        }
        
        
      });
  }

  onClickMajor(major: string, fac_id: string) {
    this.getDataCap(fac_id, major, '0');
  }

  // getMejor(fac_id:any): void {
  //   var data = {
  //     opt: 'list_major',
  //     campus_id: '43',
  //     faculty_id: fac_id
  //   }
  //   this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
  //   .subscribe({ 
  //     next: (res: any) => {
  //       this.majorList = res;
  //       console.log('Major ',res); // เเสดงค่าใน console
  //       //this.countNumStdCap(this.majorList.majorname, fac_id);
  //     }
  //   });
  // }


  // student cap
  getDataCapApprove(Id: string): void {
    this.http
      .get(environment.baseUrl + '/getdatacap.php?fac_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capData = res;
        //console.log('cap data: ', this.capData)
      });
  }

  // student cap
  getDataCapNotApprove(Id: string): void {
    this.http
      .get(environment.baseUrl + '/getdatacap.php?fac_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capData = res;
        //console.log('cap data: ', this.capData)
      });
  }

  submitApprove(Id: any, fac_id: any) {
    //console.log('Id cap', Id);
    this.http
      .get(environment.baseUrl + '/updateApprove.php?id=' + Id + '&action=approve') //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.result = res;
        console.log('cap data: ', this.result)
        //this.getDataCap(fac_id);
      });
  }

  notApprove(Id: any, fac_id: any) {
    //console.log('Id cap not: ', Id);
    this.http
      .get(`${environment.baseUrl}/updateApprove.php?id=${Id}&action=notapprove`) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.result = res;
        //console.log('cap data: ', this.result)
        //this.getDataCap(fac_id);

      });
  }
}
