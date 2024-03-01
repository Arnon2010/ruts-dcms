import { Component, ElementRef, ViewChild, OnInit, HostListener, HostBinding, Renderer2 } from '@angular/core';
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
  @ViewChild('mySidenav') mySidenav: ElementRef | undefined;
  @ViewChild('main') main: ElementRef | undefined;

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

  isSidebarClosed = true;
  items: any[] = []; // Define your array of items here

  constructor(
    private dataService: ApiService,
    private router: Router,
    private renderer: Renderer2, private elRef: ElementRef
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

  toggleMenu(event: any) {
    let arrowParent = event.target.parentElement.parentElement;
    arrowParent.classList.toggle('showMenu');
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  openNav() {
    if (this.mySidenav && this.main) {
      this.mySidenav.nativeElement.style.width = "250px";
      this.main.nativeElement.style.marginLeft = "250px";
    }
  }
  
  closeNav() {
    if (this.mySidenav && this.main) {
      this.mySidenav.nativeElement.style.width = "0";
      this.main.nativeElement.style.marginLeft = "0";
    }
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
