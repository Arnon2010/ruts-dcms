import { ReportComponent } from './report/report.component';
import { UploadComponent } from './uploadfile/uploadfile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
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
import { AgendaTopicAdminComponent } from './agenda-topic-admin/agenda-topic-admin.component';
import { MeetingSaveComponent } from './meeting-save/meeting-save.component';
import { MeetingSaveTopicComponent } from './meeting-save-topic/meeting-save-topic.component';
import { MeetingPrepareComponent } from './meeting-prepare/meeting-prepare.component';
import { MeetingTimeManageComponent } from './meeting-time-manage/meeting-time-manage.component';
import { AgendaComponent } from './agenda/agenda.component';
import { HomeOutsiderComponent } from './home-outsider/home-outsider.component';
import { MeetingTopicComponent } from './meeting-topic/meeting-topic.component';
import { AdminComponent } from './admin/admin.component';
import { MeetingAllComponent } from './meeting-all/meeting-all.component';
import { ReportCertifyComponent } from './report-certify/report-certify.component';
import { ReportCompleteComponent } from './report-complete/report-complete.component';
import { PdfTestComponent } from './pdf-test/pdf-test.component';
import { CertifyComponent } from './certify/certify.component';
import { CertifyConfirmComponent } from './certify-confirm/certify-confirm.component';
import { CertifyDetailComponent } from './certify-detail/certify-detail.component';
import { AssignsComponent } from './assigns/assigns.component';

const routes: Routes = [
 
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
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
      { path: 'meeting-manage', component: MeetingManageComponent, canActivate: [AuthGuard] }, // route ผู้ดูแลระบบ
      { path: 'meeting-time/:open_code', component: MeetingTimeComponent, canActivate: [AuthGuard] }, 
      { path: 'agenda-manage/:open_code/:meeting_code/:open_title', component: AgendaManageComponent, canActivate: [AuthGuard] }, 
      
      { path: 'meeting-save', component: MeetingSaveComponent, canActivate: [AuthGuard] }, 
      { path: 'meeting-save-topic/:meeting_code', component: MeetingSaveTopicComponent, canActivate: [AuthGuard] }, 
      { path: 'meeting-prepare', component: MeetingPrepareComponent, canActivate: [AuthGuard] }, 
      { path: 'meeting-time-manage/:meeting_code/:open_code', component: MeetingTimeManageComponent, canActivate: [AuthGuard] }, 
      { path: 'report', component: ReportComponent, canActivate: [AuthGuard]}, // route report
      { path: 'report-certify', component: ReportCertifyComponent, canActivate: [AuthGuard]}, // route report certify
      { path: 'report-complete', component: ReportCompleteComponent, canActivate: [AuthGuard]}, // route report complete
      { path: 'certify-detail/:meeting_code/:open_code', component: CertifyDetailComponent, canActivate: [AuthGuard] }, 
      
      // การเสนอวาระ
      { path: 'agenda-topic-admin/:meeting_code', component: AgendaTopicAdminComponent, canActivate: [AuthGuard] }, 
      { path: 'agenda-topic/:meeting_code', component: AgendaTopicComponent, canActivate: [AuthGuard] }, //เสนอวาระตามวาระแต่ละข้อ
      { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },  // การเสนอวาระการประชุม

      { path: 'assigns', component: AssignsComponent, canActivate: [AuthGuard]}, // มอบหมายงาน

      // ผู้ใช้งานภายนอก
      { path: 'home-outsider', component: HomeOutsiderComponent, canActivate: [AuthGuard] },  // การเสนอวาระการประชุม

      // ผู้เข้าร่วมประชุม
      { path: 'meeting-topic/:meeting_code/:open_code', component: MeetingTopicComponent, canActivate: [AuthGuard] }, 
      { path: 'meeting-all', component: MeetingAllComponent, canActivate: [AuthGuard] }, 
      { path: 'certify', component: CertifyComponent, canActivate: [AuthGuard] }, 
      { path: 'certify-confirm/:meeting_code/:open_code', component: CertifyConfirmComponent, canActivate: [AuthGuard] }, 


       // ผู้ดูแลระบบ
       { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }, 
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
   // test pdf file
   { path: 'pdf-test', component: PdfTestComponent },

  //{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, // route Home
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard]}, // route report
  { path: 'loginrutsapp/:token', component: LoginrutsappComponent}, // route ไปหน้าหลักของนักศึกษา
  { path: 'uploadfile', component: UploadComponent, canActivate: [AuthGuard] }, // route ไปหน้าของอัพโหลดเอกสาร
  { path: 'login', component: LoginComponent }, // route ไปการ Login ของนักศึกษา
  { path: 'logout', component: LogoutComponent },
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
