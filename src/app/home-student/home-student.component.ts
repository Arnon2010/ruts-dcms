import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PdfService } from '../services/pdf.service';
import { FileUploadService } from '../services/file-upload.service';
import { faCircleChevronRight, faEnvelope, faCaretRight, faCaretLeft, faSquareCaretLeft, faFilePdf, faSquareCheck, faRectangleXmark, faFloppyDisk, faCoffee, faCheck, faCircleXmark, faCircleCheck, faW, faMagnifyingGlass, faFilePen, faBook, faBookOpen, faClock, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import {SafeUrl, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//import { InteractService } from './interact.service';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
  styleUrls: ['./home-student.component.css']
})
export class HomeStudentComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  
  studentData: any;
  //icon fontawesome
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
  faEnvelope = faEnvelope;
  faCircleChevronRight = faCircleChevronRight;

  capList: any; //ประเภทหลักสูตร
  course_name: string = '';//ด้านของหลักสูตร
  cap_courses: any = []; //หลักสูตรเข้าร่วม
  pathFilePdf: string = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  public pdfSrc ='https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  pdfBlobURL: string | ArrayBuffer | null = null;
  public zoom = '150%';
  public base64File : string = '';
  course_type: string | undefined;
  fileUrlCap: any;

  //Upload
  selectedFiles: File[] = [];
  fileUpload: File[] = [];
  uploadProgress = 0;
  cap_type_id: any;
  Note: any;

  // capList: capType[] = [];
  capTypeList: any[] | undefined; // Define the property with the correct type
  // upload: uploadForm = {
  //   cap_type_id: 0,
  //   Note: '',
  // };

  capname: any;

  form: FormGroup = new FormGroup({
    capTypeId: new FormControl(''),
    courseName: new FormControl(''),
    noteText: new FormControl(''),
    fileUpload: new FormControl(''),
  });

  submitted = false;
  id: string | null | undefined;

  image: string | SafeUrl =
    "https://images.unsplash.com/photo-1521911528923-9c3838123490?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";

  confirmSend: boolean = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private http: HttpClient, 
    private pdfService: PdfService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private formBuilder: FormBuilder,
    private fileUploadService: FileUploadService) { 
    }

  ngOnInit(): void {
    //this.id = this.route.snapshot.queryParamMap.get('id');
    //console.log('id: ',this.id)
    this.getStudentData();    
     //ประเภทด้านการประกวด
     this.http
     .get(environment.baseUrl + '/getcaptype.php')
     .subscribe((response:any) => {
       //console.log('capList: ', response);
       this.capTypeList = response.data;
     });

     this.form = this.formBuilder.group(
      {
        capTypeId: ['', Validators.required],
        courseName: ['', Validators.required],
        noteText: ['', Validators.nullValidator],
        fileUpload: ['', Validators.required]
      }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    //console.log('upload: ,',JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.selectedFiles = [];
    this.confirmSend = false;
    this.form.reset();
  }

  async downloadPdf() {
    const pdfUrl = 'https://example.com/path-to-your-pdf.pdf';
    try {
      const base64Pdf = await this.pdfService.getPdfAsBase64(pdfUrl);
      //console.log('Base64 PDF:', base64Pdf);
    } catch (error) {
      //console.error('Error downloading PDF:', error);
    }
  }

  courseDetail(item:any, course:string) :void{
    //console.log('course detail: ',item);
    this.course_type = course;
    this.cap_courses = item;
  }

  async openAnyFile(file_path:any, course_name:any) {
    this.course_name = course_name;
    let path = environment.baseUrlUpload + file_path;
    this.fileUrlCap = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    //console.log('file_path: ',this.fileUrlCap);
  }

  getStudentData(): void {
    const Token: any = localStorage.getItem('Token');
    this.studentData = JSON.parse(Token) //ให้ตัวเเปล studentData เท่ากับ ค่าจาก local storage ใน Key Token ที่อยู่ใน รูปเเบบ Json
    //console.log('student: ', this.studentData); //เเสดงค่า studentData ใน console
    let std_id = this.studentData.studentid;
    //console.log('std id: ',std_id);
    this.stdDataCapType(std_id);
  }

  stdDataCapType(std_id:string): void {
    var data = {
      student_id: std_id
    }
    this.http.post(environment.baseUrl + '/dataStdCapType.php', data)
    .subscribe({ 
      next: (res: any) => {
        this.capList = res.data;
        //console.log('Cap ',res); // เเสดงค่าใน console
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
        //console.log('Faculty ',res); // เเสดงค่าใน console
      }
    });
  }

  getMejor(): void {
    var data = {
      opt: 'list_major',
      campus_id: '43',
      faculty_id: '05'
    }
    this.http.post('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php', data)
    .subscribe({ 
      next: (res: any) => {
        //console.log('Major ',res); // เเสดงค่าใน console
      }
    });
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
    //console.log('Files: ', this.selectedFiles);

    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(event.target.files[0])
    );

    console.log('image: ', this.image);
  }

  sendToConfirm() {
    this.confirmSend = true;
  }

  cancelToConfirm() {
    this.confirmSend = false;
  }

  uploadFilesConfirm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    //console.log('upload: ,',JSON.stringify(this.form.value, null, 2));
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file_certificate[]', this.selectedFiles[i]);
    }

    formData.append('gradsemester', this.studentData.gradsemester);
    formData.append('std_id', this.studentData.studentid);
    formData.append('std_prefix', this.studentData.prefixname);
    formData.append('std_name', this.studentData.firstname);
    formData.append('std_lastname', this.studentData.lastname);
    formData.append('gradsemester', this.studentData.gradsemester);
    formData.append('pro_id', '');
    formData.append('pro_name', this.studentData.majorname);
    formData.append('fac_id', '');
    formData.append('fac_name', this.studentData.facultyname);
    formData.append('note', this.form.value.noteText);
    formData.append('course_name', this.form.value.courseName);
    formData.append('cap_type_id', this.form.value.capTypeId);

    // const req = new HttpRequest('POST', ${this.baseUrl}/upload.php, formData, {
    //   reportProgress: true,
    //   responseType: 'text'

    // this.fileUploadService.uploadFile(formData).subscribe(
    //   (event: any) => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.uploadProgress = Math.round((100 * event.loaded) / event.total);
    //     } else if (event.type === HttpEventType.Response) {
    //       // File upload is complete
    //       console.log('File uploaded successfully:', event.body);
    //     }
    //   },
    //   (error: any) => {
    //     console.error('Error uploading file:', error);
    //   }
    // );


    this.http.post(environment.baseUrl + '/uploadfile.php', formData).subscribe(
      (response) => {
        
        Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success').then(() => {
          this.onReset();
          this.stdDataCapType(this.studentData.studentid);
        })
        //console.log('Files uploaded successfully');
        //console.log(response); // แสดงข้อมูลที่ส่งกลับมาจาก API
        // ทำการประมวลผลข้อมูลเพิ่มเติมตามต้องการ
      
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
        //console.log('capname: ', this.capname)
      });
  }

  clearFiles() {
    //this.selectedFiles = [];
    this.cap_type_id = '';
    this.course_name = '';
    this.Note = '';
    //this.fileUpload = ;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = ''; // Clear the input value
      this.selectedFiles = []; // Clear the selected file reference
    }
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
