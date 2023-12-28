import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faCaretRight, faCaretLeft, faSquareCaretLeft, faFilePdf, faSquareCheck, faRectangleXmark, faFloppyDisk, faCoffee, faCheck, faCircleXmark, faCircleCheck, faW, faMagnifyingGlass, faFilePen, faBook, faBookOpen, faClock, faSquareXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-faculty-capconfirm',
  templateUrl: './faculty-capconfirm.component.html',
  styleUrls: ['./faculty-capconfirm.component.css']
})
export class FacultyCapconfirmComponent {
  /// icon
  faCoffee = faCoffee;
  faCheck = faCheck;
  faCircleCheck = faCircleCheck; //ไอคอนผ่าน
  faCircleXmark = faCircleXmark; //ไอคอนไม่ผ่าน
  faMagnifyingGlass = faMagnifyingGlass;
  faW = faW;
  faFilePen = faFilePen;
  faBook = faBook;
  faBookOpen = faBookOpen;
  faClock = faClock;
  faSquareXmark = faSquareXmark;
  faFloppyDisk = faFloppyDisk;
  faRectangleXmark = faRectangleXmark;
  faSquareCheck = faSquareCheck;
  faSquareCaretLeft = faSquareCaretLeft;
  faCaretRight = faCaretRight;
  faCaretLeft = faCaretLeft;
  faFilePdf = faFilePdf;

  userData: any;
  capData: any;
  result: any;
  mapFacId: string = '';
  majorList: any = [];
  majorCapData: any = [];
  stdId: string | null;
  capStudent: any = [];
  studentData: any = [];
  course_name: string | undefined;
  cap_courses: any;
  text: string | undefined;
  fileUrlCap: any;
  std:any = []; //ข้อมูลนักศึกษา
  approv_status:string | undefined;
  approv_feedback:string | undefined;
  studentList: any = [];
  studentId:string | undefined;
  students: any = [];
  spl_std: any = [];
  std_next: any = [];

  selectedValue: any; // Declare a variable to store the selected value
  options = ['Option 1', 'Option 2', 'Option 3']; // Your select options
  userId: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer

  ) {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log('user fac: ',this.userData); //เเสดงค่า studentData ใน console
    this.mapFacId = this.userData.map_fac_id; //รหัสคณะ Map กับ สวท.
    this.userId = this.userData.user_id; //รหัสคณะ Map กับ สวท.
    this.stdId = this.route.snapshot.paramMap.get('id'); // รหัสนักศึกษา/epassport
    this.getCapOfStudent(this.stdId);
    this.getDataStudent(this.stdId);
    this.getListStudent(this.mapFacId);
    this.studentId = '0';
  }

  onItemSelected(student:any): void {
    this.spl_std = student.split(' ');
    let std_id = this.spl_std[0];
    //console.log('std_id: ',std_id);
    this.router.navigate(['/fcapconfirm/' + std_id]);
    this.getCapOfStudent(std_id);
    this.getDataStudent(std_id);
  }

  //ข้อมูลถัดไป
  selectNextValue() {
    //let std_id = item.std_id + ' ' + item.std_prefix + item.std_name + ' ' + item.std_lastname;
    //console.log('studentId ', std);
    // console.log('students ',this.students);
    // console.log('options ',this.options);

    const currentIndex = this.students.indexOf(this.studentId);
    console.log('currentIndex ', currentIndex);
    if (currentIndex !== -1 && currentIndex < this.students.length - 1) {
      this.studentId = this.students[currentIndex + 1];
      this.onItemSelected(this.studentId);
    }
  }
  // ข้อมูลก่อนหน้า
  selectPrevious() {
    const currentIndex = this.students.indexOf(this.studentId);
    console.log('currentIndex ', currentIndex);
    if (currentIndex > 0) {
      this.studentId = this.students[currentIndex - 1];
      this.onItemSelected(this.studentId);
    }
  }

  selectNextValueTest() {
    console.log('selectedValue: ',this.selectedValue);
    const currentIndex = this.options.indexOf(this.selectedValue);
    console.log('currentIndex: ',currentIndex);
    if (currentIndex !== -1 && currentIndex < this.options.length - 1) {
      this.selectedValue = this.options[currentIndex + 1];
    }
  }

  getFaculty(): void {
    var data = {
      opt: 'list_faculty'
    }
    this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
      .subscribe({
        next: (res: any) => {
          console.log('Faculty ', res); // เเสดงค่าใน console
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

  onClickViewConfirm(item:any) {
    console.log('item std_id: ', item);
    this.std = item;
    this.approv_status = item.approv_status;
    this.approv_feedback = item.approv_feedback; 
    let pahtFileCap = environment.baseUrlUpload + item.path_certificate; //path file pdf
    this.fileUrlCap = this.sanitizer.bypassSecurityTrustResourceUrl(pahtFileCap);
    //this.approv_feedback = undefined;
  }

  onSubmitConfirm(std_id:any, id:any, approvStatus:any, approv_feedback:any) {
    console.log('id cap: ',id);
    var data = {
      opt: 'confirm',
      id_cap: id,
      approv_status: approvStatus,
      approv_feedback: approv_feedback,
      user_id: this.userId
    }

    this.http.post(environment.baseUrl + '/confirm_capacity.php', data)
      .subscribe({
        next: (res: any) => {
          //this.majorCapData = res.data;
          if(res.data.status == 'true') {

            this.getCapOfStudent(std_id);
          } else {
            console.log('confirm_capacity ', res); // เเสดงค่าใน console
          }
        }
      });
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

  courseDetail(item: any, course: string): void {
    console.log('course detail: ', item);
    this.course_name = course;
    this.cap_courses = item;
  }

  // รายชื่อนักศึกษาทั้งหมด
  getListStudent(fac_id: any): void {
    this.http
      .get(environment.baseUrl + '/student_list.php?fac_id=' + fac_id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        //this.studentList = res.data;
        this.students = res;

        console.log('list student: ', this.studentList)
      });
  }

  //ข้อมูลนักศึกษา
  getDataStudent(Id: any): void {
    this.http
      .get(environment.baseUrl + '/studentdata.php?std_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.studentData = res;
        console.log('data studentData: ', this.studentData)
      });
  }

  // student cap
  getCapOfStudent(Id: any): void {
    this.http
      .get(environment.baseUrl + '/getcapstudent.php?std_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capStudent = res.data;
        console.log('cap data student: ', this.capStudent)
      });
  }

  // student cap of faculty
  getDataCapApprove(Id: string): void {
    this.http
      .get(environment.baseUrl + '/getdatacap.php?fac_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capData = res;
        console.log('cap data: ', this.capData)
      });
  }

  // student cap
  getDataCapNotApprove(Id: string): void {
    this.http
      .get(environment.baseUrl + '/getdatacap.php?fac_id=' + Id) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capData = res;
        console.log('cap data: ', this.capData)
      });
  }

  submitApprove(Id: any, fac_id: any) {
    console.log('Id cap', Id);
    this.http
      .get(environment.baseUrl + '/updateApprove.php?id=' + Id + '&action=approve') //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.result = res;
        console.log('cap data: ', this.result)
        //this.getDataCap(fac_id);
      });
  }

  notApprove(Id: any, fac_id: any) {
    console.log('Id cap not: ', Id);
    this.http
      .get(`${environment.baseUrl}/updateApprove.php?id=${Id}&action=notapprove`) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.result = res;
        console.log('cap data: ', this.result)
        //this.getDataCap(fac_id);

      });
  }
}
