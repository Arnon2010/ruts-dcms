import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-meeting-add-agenda',
  templateUrl: './meeting-add-agenda.component.html',
  styleUrls: ['./meeting-add-agenda.component.css']
})

export class MeetingAddAgendaComponent implements OnInit {

  form!: FormGroup;
  agenda: any = {}
  FAClist: any;
  agenda_list: any;

  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // other options
  ];
  

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      selectedValues: this.fb.array([]),
    });
  }

  get selectedValues() {
    return this.form.get('selectedValues') as FormArray;
  }

  addToSelectedValues(value: string) {
    this.selectedValues.push(this.fb.control(value));
  }
  
  removeFromSelectedValues(index: number) {
    this.selectedValues.removeAt(index);
  }
  

  getFac(): void {
    var data = {
      opt: 'viewTable',
      "Table": "FACULTY"
    }
    this.http.post('https://eis.rmutsv.ac.th/api/eis/userpermission.php', data)
      .subscribe({
        next: (res: any) => {
          //console.log('Faculty ', res); // เเสดงค่าใน console
          this.FAClist = res;
        }
      });
  }

  fetchTypeMeeting() {
    this.http
      .get(environment.baseUrl + '/_type_data.php') //ติดต่อไปยัง Api getfaculty.php
      .subscribe((res: any) => { // ดึงข้อมูลในฟิลด์ fac_id, fac_name
        //console.log(res);
        this.agenda_list = res.data;
      });
  }

  // Add and Update User.
  saveMeeting(item: any) {
    this.agenda = item;
    console.log('save meeting', this.agenda);
    this.http.post(environment.baseUrl + '/_meeting_save.php', this.agenda).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
           //
        }
      },
      (error) => {
       
        console.log('Error adduser: ', error);
      }
    );
  }



}


