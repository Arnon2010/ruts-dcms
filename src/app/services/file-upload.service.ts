import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  uploadFile(formData: any): Observable<HttpEvent<any>> {
   
    const request = new HttpRequest('POST', environment.baseUrl + '/uploadfile.php', formData, {
      reportProgress: true, // Enable progress tracking
    });

    return this.http.request(request);
  }

}
