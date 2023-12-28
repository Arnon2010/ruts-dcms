import { HttpClient } from '@angular/common/http';
import { Component ,OnInit} from '@angular/core';
import { Validators,  FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  frmRegister = this.formBuilder.group ({
    std_id : ['', Validators.required],
    std_password : ['', Validators.required]
  });


  constructor(private http:HttpClient , private formBuilder : FormBuilder ) {}

  ngOnInit(): void {

  }

  register(){
    this.http.post('http://localhost/studycheck/Api/register.php',this.frmRegister.value).subscribe({ //ติดต่อไปยัง Api register.php
      next : (res) => {
        console.log(res);
      }
    })
  }


}
