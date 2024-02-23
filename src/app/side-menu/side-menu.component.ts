import { Component, ElementRef, ViewChild, OnInit, HostListener, HostBinding } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { faUsers, faHome, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  @ViewChild('sideMenu') sideMenu: ElementRef;

  // menuslist = [1, 2, 3, 4, 5, 6, 7, 8];

  // @HostBinding('class.active') isMenuOpen: boolean = false;
  faHome = faHome;
  faFilePen = faFilePen;

  title = 'studycheck';
  isLogin: any;
  isNavHidden: string | undefined;
  user_role: any;
  userData: any;

  user:any = {};
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

    this.getUser();
    
  }


  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    console.log('user:, ', this.userData);

    this.user.fac_code = this.userData.faculty_code;
    this.user.fac_name = this.userData.faculty_name;
    this.user.user_id = this.userData.user_id;
    this.user.user_fname = this.userData.user_fname;
    this.user.user_lname = this.userData.user_lname;
    this.user.citizen_id = this.userData.cid;
    this.user.user_role = this.userData.user_role; //สิทธิ์การใช้งาน

  }

  // menuItemClickHandler(e:any, index:any) {
  //   e.stopPropagation();
  //   // something magical  🧙✨
  //   console.log(index);
  //   this.toggle(e);
  // }

  // @HostListener('click', ['$event']) click(e:any) {
  //   e.stopPropagation();
  // }
  
  // @HostListener("document:click") resetToggle() {
  //   this.isMenuOpen = false;
  // }

  // toggle(e:any) {
  //   e.stopPropagation();
  //   console.log('toggle')
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  hideSideMenu() {
    // ซ่อน sidemenu โดยใช้ ViewChild
    //console.log('ซ่อน sidemenu โดยใช้ ViewChild');
    this.isNavHidden = 'none';
    //this.sideMenu.nativeElement.style.display = 'none';
  }
}
