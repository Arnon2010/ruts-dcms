import { Component, HostBinding, HostListener } from '@angular/core';
import { faHouse } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidenavWidth = 4;
  ngStyle: string | undefined;
  userData: any;
  user:any = {};

  constructor() {}

  ngOnInit() {
    this.getUser();
  }

  increase() {
    this.sidenavWidth = 15;
    console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 4;
    console.log('decrease sidenav width');
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
