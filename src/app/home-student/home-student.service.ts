import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HomeStudentService {
  private apiUrl = 'http://localhost/studycheck/Api/studentdata.php';

  constructor(private http: HttpClient) {}

  getStudentData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getFaculty(): Observable<any> {
    return this.http.get('https://sis.rmutsv.ac.th/sis/api/pdo_mysql_arit.php');
  }
}
