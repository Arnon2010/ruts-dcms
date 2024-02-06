import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-masteradmin',
  templateUrl: './masteradmin.component.html',
  styleUrls: ['./masteradmin.component.css']
})
export class MasteradminComponent {
  isLogin: any;
  isNavHidden: string | undefined;

  constructor(private dataService: ApiService) {
    // กำหนดค่าเริ่มต้นให้ sideMenu เป็น ElementRef
    this.isLogin = this.dataService.isLoggedIn();
    console.log(this.isLogin);
  }

  ngOnInit() {
    
  }

}

