import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private http: HttpClient) { }

  getPdfAsBase64(url: string): Promise<string> {
    return this.http.get(url, { responseType: 'arraybuffer' })
      .toPromise()
      .then((response:any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        });
      });
  }
}
