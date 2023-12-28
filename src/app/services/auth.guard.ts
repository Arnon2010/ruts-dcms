// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // You need to implement this service

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: ApiService, private router: Router) { }
    //   canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    //   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     if (this.authService.isLoggedIn()) {
    //       console.log('test test');
    //       return true;
    //     } else {
    //       // Redirect to the login page if the user is not authenticated
    //       return this.router.parseUrl('/selectlogin');
    //     }
    //   }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const routeurl: string = state.url;
        return this.isLogin(routeurl);
    }

    isLogin(routeurl: string): boolean {
        if (this.authService.isLoggedIn()) {
            console.log('login true');
            return true;
        } else {
            //this.authService.redirectUrl = routeurl;
            this.router.navigate(['/selectlogin1']);
            console.log('login false');
           return false;
        }


        // if (this.dataService.isLoggedIn() && this.dataService.isAuthenticated()) {
        //   return true;
        // } else {
        //   this.dataService.redirectUrl = routeurl;
        //   this.router.navigate(['/login'], { queryParams: { returnUrl: routeurl } });
        //   return false;
        // }
    }
}
