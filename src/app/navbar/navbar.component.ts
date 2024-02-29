import { Component, HostBinding, HostListener } from '@angular/core';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuslist = [1, 2, 3, 4, 5, 6, 7, 8];

  @HostBinding('class.active') isMenuOpen: boolean = false;

  constructor() { 

    console.log('navbar test ...');
  }

  faHouse = faHouse;

  menuItemClickHandler(e:any, index:any) {
    e.stopPropagation();
    // something magical  🧙‍♂️✨
    console.log(index);
    this.toggle(e);
  }
  @HostListener('click', ['$event']) click(e:any) {
    e.stopPropagation();

  }
  @HostListener("document:click") resetToggle() {
    this.isMenuOpen = false;
  }

  toggle(e:any) {
    e.stopPropagation();
    console.log('toggle')
    this.isMenuOpen = !this.isMenuOpen;
  }
}
