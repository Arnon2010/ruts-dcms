import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('sideMenu') sideMenu: {} = ElementRef;

  title = 'studycheck';
  isLogin: any;
  constructor(private dataService: ApiService) {
    this.isLogin = this.dataService.isLoggedIn();
    //console.log(this.isLogin);
  }

  ngOnInit() {
    // ตรวจสอบสถานะการล็อกอิน และซ่อน sidemenu ตามต้องการ
    if (!this.isLogin) {
      //this.hideSideMenu();
    }
  } 

  hideSideMenu() {
    // ซ่อน sidemenu โดยใช้ ViewChild
    console.log('ซ่อน sidemenu โดยใช้ ViewChild');
    // ตรวจสอบว่า sideMenu ไม่ได้เป็น undefined ก่อนที่จะให้เข้าถึง nativeElement
    // if (this.sideMenu && this.sideMenu.nativeElement) {
    //   this.sideMenu.nativeElement.style.display = 'none';
    // }
  }
  


}
