import { Injectable, Output, EventEmitter } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, Subject, of, Subscription, throwError } from "rxjs";
import { delay } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  authToken: any;
  user: any;
  tokenSubscription = new Subscription()
  timeout: any;

  private startTime: number | undefined; // Start time for authentication
  private endTime: number | undefined; // End time for authentication

  redirectUrl: string | undefined;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, private httpClient: HttpClient) { }
  //กำหนดเวลาอยู่ในระบบ
  isAuthenticated(): boolean {
    // Set the authentication time range
    this.startTime = new Date().setHours(8, 0, 0); // Set the start time to 8:00 AM
    this.endTime = new Date().setHours(11, 47, 0); // Set the end time to 5:00 PM
    const currentTime = new Date().getTime();
    
    return currentTime >= this.startTime && currentTime <= this.endTime;
  }

  /** LOGIN */
  
  eloginUser(user_epassport: any, user_password: any, file: string) {
  //console.log(body);
  let headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8',
  });
  let options = {
    headers: headers,
  };

  const data = {
    username: user_epassport,
    password: user_password
  }

  return (
    this.httpClient
      .post(file,data, options)
      // .timeout(59000) // 59 sec timeout
      .pipe(
        map((res: any) => {
          console.log('data post: ', res);
          return res;
        })
      )
  );
  //.map((res:any) => res);
}

  public userlogin(username: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders()
    }
    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    httpOptions.headers.append('Content-Type', 'application/json');
    //httpOptions.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //this.httpClient.post(<url>, <body>, httpOptions);
    return this.httpClient
      .post<any>(environment.baseUrl + '/login.php', { username, password }, httpOptions)
      .pipe(
        map((Users) => {
          this.setToken(Users[0],'token');
          this.getLoggedInName.emit(true);
          return Users;
        })
      );
  }

  // User profile
  getUserProfile(id: any) {
    let api = environment.baseUrl + '/userProfile.php?id=' + id;
    return this.httpClient.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      //catchError(this.handleError)
    );
  }

  // User profile
  getSetting() {
    let api = environment.baseUrl + '/getSetting.php';
    return this.httpClient.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      //catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  //token
  setToken(user: any, token:string) {
    localStorage.setItem(token, JSON.stringify(user));
  }

  expirationCounter(timeout:any) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');

      this.logout();
      this.router.navigate(["/login"]);
    });
  }

  logout() {
    this.tokenSubscription.unsubscribe();
    this.authToken = null;
    this.user = null;
    sessionStorage.clear();
    
  }

  emit(arg0: { username: any; }) {
    throw new Error('Method not implemented.');
  }

  getToken() {
    return localStorage.getItem('Token');
  }

  getTokenUser() {
    return localStorage.getItem('Token');
  }

  getSessionUser() {
    return sessionStorage.getItem('user');
  }

  deleteToken() {
    localStorage.removeItem('token');
    //this.logout();
  }

  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return this._isLoggedIn.asObservable();
    }
    return false;
  }


}
