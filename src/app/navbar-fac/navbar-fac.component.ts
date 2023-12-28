import { Component } from '@angular/core';
import { faHouse, faTable } from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar-fac',
  templateUrl: './navbar-fac.component.html',
  styleUrls: ['./navbar-fac.component.css']
})
export class NavbarFacComponent {

  faHouse = faHouse;
  faTable = faTable;

  constructor(private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

}
