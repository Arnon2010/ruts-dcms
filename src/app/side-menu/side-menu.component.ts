import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  @ViewChild('sideMenu') sideMenu: ElementRef;


  title = 'studycheck';
  isLogin: any;
  isNavHidden: string | undefined;
  user_role: any;
  constructor(
    private dataService: ApiService,
    private router: Router,
    ) {
    // กำหนดค่าเริ่มต้นให้ sideMenu เป็น ElementRef
    this.sideMenu = {} as ElementRef;
    this.isLogin = this.dataService.isLoggedIn();
    //console.log(this.isLogin);
    //check role
    let user: any = localStorage.getItem('Token');
    user = JSON.parse(user);
    //console.log(user);
    if(user != null) {
      this.user_role = user.user_role;
    }
  }

  ngOnInit() {
    // ตรวจสอบสถานะการล็อกอิน และซ่อน sidemenu ตามต้องการ
    if (!this.isLogin) {
      this.hideSideMenu();
      //this.sideMenu.nativeElement.style.display = 'none';
    } else {
      this.isNavHidden = 'block';
    }
    
  }

  hideSideMenu() {
    // ซ่อน sidemenu โดยใช้ ViewChild
    //console.log('ซ่อน sidemenu โดยใช้ ViewChild');
    this.isNavHidden = 'none';
    //this.sideMenu.nativeElement.style.display = 'none';
  }
}
