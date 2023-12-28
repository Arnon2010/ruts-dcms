import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadComponent implements OnInit {
  selectedFiles: File[] = [];
  studentData: any;
  cap_type_id: any;
  course_name: string = '';
  Note: any;
  // capList: capType[] = [];
  capTypeList: any[] | undefined; // Define the property with the correct type
  // upload: uploadForm = {
  //   cap_type_id: 0,
  //   Note: '',
  // };

  capname: any;

  constructor(private http: HttpClient, private location: Location) {
     //ประเภทด้านการประกวด
     this.http
     .get(environment.baseUrl + '/getcaptype.php')
     .subscribe((response:any) => {
       console.log('capList: ', response);
       this.capTypeList = response.data;
     });
  }

  ngOnInit(): void {
    this.getStudentData();

  }

  getStudentData(): void {

    const Token:any = localStorage.getItem('Token');
    this.studentData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    console.log ('stddata:, ',this.studentData); //เเสดงค่า studentData ใน console

  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

    console.log(this.selectedFiles);
  }

  uploadFilesConfirm() {
    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file_certificate[]', this.selectedFiles[i]);
    }

    formData.append('std_id', this.studentData.studentid);
    formData.append('std_prefix', this.studentData.prefixname);
    formData.append('std_name', this.studentData.firstname);
    formData.append('std_lastname', this.studentData.lastname);
    formData.append('pro_id', '');
    formData.append('pro_name', this.studentData.majorname);
    formData.append('fac_id', '');
    formData.append('fac_name', this.studentData.facultyname);
    formData.append('note', this.Note);
    formData.append('course_name', this.course_name);
    formData.append('cap_type_id', this.cap_type_id);


    // const req = new HttpRequest('POST', ${this.baseUrl}/upload.php, formData, {
    //   reportProgress: true,
    //   responseType: 'text'

    this.http.post(environment.baseUrl + '/uploadfile.php', formData, {
      reportProgress: true,
      responseType: 'text'}).subscribe(
      (response) => {
        Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
          this.reloadPage();
        })
        console.log('Files uploaded successfully');
        console.log(response); // แสดงข้อมูลที่ส่งกลับมาจาก API
        // ทำการประมวลผลข้อมูลเพิ่มเติมตามต้องการ

      //   if (event.type === HttpEventType.UploadProgress) {
      //     this.progress[num] = Math.round(100 * event.loaded / event.total);
      //     console.log( this.progress);
      // } else if (event instanceof HttpResponse) {
      //     //this.message = event.body.message;
      //     if(event.type==4){
      //     // กรณี upload มากกว่า1ไฟล์ ชื่อไม่ตรงกัน
      //         name=='S_chkupfile3_2' ? this.form['S_chkupfile3']=chk:this.form[name]=chk;
      //         this.toastr.success("Upload-File Successfully","Message");
      //     }
      //     //else{
      //      //   this.toastr.error("Sorry, your file was not uploaded");
      //     //}
      // }

      },
      (error) => {
        Swal.fire('บันทึกข้อมูลไม่สำเร็จ', '', 'error').then(() => {
          //this.reloadPage();
        })
        console.log('Error uploading files');
        console.error(error); // แสดงข้อผิดพลาดที่เกิดขึ้น
        // ทำการจัดการข้อผิดพลาดตามต้องการ
      }
    );

  }
  getcaptype()  {
    this.http
      .get(`http://localhost/studycheck/Api/getcaptype.php`) //ติดต่อไปยัง Api studentdata.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ std_prefix, std_name, std_lastname, std_phone, std_email
        this.capname = res.capname;
        console.log('capname: ', this.capname)

      });
  }

  clearFiles() {
    this.selectedFiles = [];
  }
  reloadPage() {
    this.location.go(this.location.path());
    window.location.reload();
  }
}

export interface uploadForm {
  cap_type_id: Number;
  Note: String;
}

export interface capType {
  cap_type_id: Number;
  cap_type_name: String;
  status: String;
}
