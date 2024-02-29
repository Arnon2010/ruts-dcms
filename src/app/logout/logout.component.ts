import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  isLogin: boolean | undefined;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    
    this.clearToken()
  }
    clearToken(){
      localStorage.removeItem('Token');
      this.isLogin = false;
      this.router.navigate(['login'], {});
    }
  
}

