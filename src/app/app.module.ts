import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeStudentComponent } from './home-student/home-student.component';
import { LoginComponent } from './login/login.component';
import { FaculutyWebManagementComponent } from './faculuty-web-management/faculuty-web-management.component';
import { MasteradminComponent } from './masteradmin/masteradmin.component';
import { UploadComponent } from './uploadfile/uploadfile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { AdduserComponent } from './adduser/adduser.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { SelectloginComponent } from './selectlogin/selectlogin.component';
import { LogoutComponent } from './logout/logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ExamplePdfViewerComponent } from './example-pdf-viewer/example-pdf-viewer.component';
import { FacultyCapconfirmComponent } from './faculty-capconfirm/faculty-capconfirm.component';
import { NavbarFacComponent } from './navbar-fac/navbar-fac.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FooterComponent } from './footer/footer.component'; // <-- import the module
import { AuthGuard } from './services/auth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginrutsappComponent } from './loginrutsapp/loginrutsapp.component';
import { ReportComponent } from './report/report.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeStudentComponent,
    LoginComponent,
    FaculutyWebManagementComponent,
    MasteradminComponent,
    UploadComponent,
    NavbarComponent,
    RegisterComponent,
    AdduserComponent,
    AdminloginComponent,
    SelectloginComponent,
    LogoutComponent,
    ExamplePdfViewerComponent,
    FacultyCapconfirmComponent,
    NavbarFacComponent,
    NavbarAdminComponent,
    FooterComponent,
    LoginrutsappComponent,
    ReportComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule ,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxExtendedPdfViewerModule,
    NgxPaginationModule

  ],
  providers: [AuthGuard, {provide:LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
