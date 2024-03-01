import { Component, ElementRef, ViewChild, OnInit, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { faUsers, faHome, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  faHome = faHome;
  faFilePen = faFilePen;

  title = 'studycheck';
  isLogin: any;
  isNavHidden: string | undefined;
  user_role: any;
  userData: any;

  user:any = {};

  isSidebarClosed = false;
  items: any[] = []; // Define your array of items here
  
  constructor(
    private dataService: ApiService,
    private router: Router,
    ) {

  }

  ngOnInit() {
    this.getUser();
  }

  toggleMenu(event: any) {
    let arrowParent = event.target.parentElement.parentElement;
    arrowParent.classList.toggle('showMenu');
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  getUser(): void {
    const Token: any = localStorage.getItem('Token');
    this.userData = JSON.parse(Token);
    //console.log('user:, ', this.userData);
    this.user.fac_code = this.userData.faculty_code;
    this.user.fac_name = this.userData.faculty_name;
    this.user.user_id = this.userData.user_id;
    this.user.user_fname = this.userData.user_fname;
    this.user.user_lname = this.userData.user_lname;
    this.user.citizen_id = this.userData.cid;
    this.user.user_role = this.userData.user_role; //สิทธิ์การใช้งาน
  }

}
