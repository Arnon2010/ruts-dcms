import { ReportComponent } from './report/report.component';
import { UploadComponent } from './uploadfile/uploadfile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeStudentComponent } from './home-student/home-student.component';
import { LoginComponent } from './login/login.component';
import { FaculutyWebManagementComponent } from './faculuty-web-management/faculuty-web-management.component';
import { MasteradminComponent } from './masteradmin/masteradmin.component';
import { AdduserComponent } from './adduser/adduser.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { SelectloginComponent } from './selectlogin/selectlogin.component';
import { LogoutComponent } from './logout/logout.component';
import { FacultyCapconfirmComponent } from './faculty-capconfirm/faculty-capconfirm.component';
import { AuthGuard } from './services/auth.guard';
import { LoginrutsappComponent } from './loginrutsapp/loginrutsapp.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { PositionsComponent } from './positions/positions.component';
import { MeetingSettingComponent } from './meeting-setting/meeting-setting.component';
import { OutsiderComponent } from './outsider/outsider.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { MeetingManageComponent } from './meeting-manage/meeting-manage.component';
import { MeetingManageTopicComponent } from './meeting-manage-topic/meeting-manage-topic.component';
import { MeetingTimeComponent } from './meeting-time/meeting-time.component';
import { AgendaManageComponent } from './agenda-manage/agenda-manage.component';
import { AgencyTopicComponent } from './agency-topic/agency-topic.component';
import { AgendaTopicComponent } from './agenda-topic/agenda-topic.component';

const routes: Routes = [
 
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, // route Home
      { path: 'meeting-setting', component: MeetingSettingComponent, canActivate: [AuthGuard]}, //กำหนดชื่อการประชุม 
      { path: 'user', component: UsersComponent, canActivate: [AuthGuard]}, //เพิ่มผู้ใช้ระบบ Admin,user
      { path: 'outsider', component: OutsiderComponent, canActivate: [AuthGuard]}, //เพิ่มผู้ใช้งานภายนอก
      { path: 'admin', component: MasteradminComponent, canActivate: [AuthGuard] }, // route ผู้ดูแลระบบ
      { path: 'meeting-manage', component: MeetingManageComponent, canActivate: [AuthGuard] }, // route ผู้ดูแลระบบ
      { path: 'meeting-time/:id/:name', component: MeetingTimeComponent, canActivate: [AuthGuard] }, 
      { path: 'agenda-manage/:open_code/:meeting_code', component: AgendaManageComponent, canActivate: [AuthGuard] }, 
      { path: 'agenda-topic/:meeting_code', component: AgendaTopicComponent, canActivate: [AuthGuard] },  // เสนอวาระการประชุม
    ]
  },
  // Auth Routes
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () =>import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  //{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, // route Home
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard]}, // route report
  { path: 'loginrutsapp/:token', component: LoginrutsappComponent}, // route ไปหน้าหลักของนักศึกษา
  { path: 'homestudent', component: HomeStudentComponent, canActivate: [AuthGuard] }, // route ไปหน้าหลักของนักศึกษา
  { path: 'uploadfile', component: UploadComponent, canActivate: [AuthGuard] }, // route ไปหน้าของอัพโหลดเอกสาร
  { path: 'selectlogin', component: SelectloginComponent}, // route ไปหน้าเลือกการ Login
  { path: 'login', component: LoginComponent }, // route ไปการ Login ของนักศึกษา
  { path: 'adminlogin', component: AdminloginComponent }, // route ไปการ Login ของ คณะเเละกองพัฒ
  { path: 'fmanagement', component: FaculutyWebManagementComponent, canActivate: [AuthGuard] }, // route ไปหน้าหลักคณะ
  { path: 'logout', component: LogoutComponent },
 
  { path: 'adduser', component: AdduserComponent, canActivate: [AuthGuard] }, // route ไปหน้าเพิ่ม user ของกองพัฒ
  { path: 'fcapconfirm/:id', component: FacultyCapconfirmComponent, canActivate: [AuthGuard] }, // route ไปหน้าเพิ่ม user ของคณะเพื่อยืนยันสมรรถนะ
  
  //new 
  { path: 'position', component: PositionsComponent, canActivate: [AuthGuard]}, //
  { path: 'side-menu', component: SideMenuComponent, canActivate: [AuthGuard]}, //กำหนดชื่อการประชุม 
  { path: '**', redirectTo: '/login' }, // หากใส่ url ไม่ถูกต้องจะทำการ Redirect ไป หน้าเลือกการ Login 


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }, )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
