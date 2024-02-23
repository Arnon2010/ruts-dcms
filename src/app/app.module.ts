import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from './footer/footer.component'; // <-- import the module
import { AuthGuard } from './services/auth.guard';
import { CommonModule, HashLocationStrategy, JsonPipe, LocationStrategy } from '@angular/common';
import { LoginrutsappComponent } from './loginrutsapp/loginrutsapp.component';
import { ReportComponent } from './report/report.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { PositionsComponent } from './positions/positions.component';
import { MeetingSettingComponent } from './meeting-setting/meeting-setting.component';

import { CdkStepperModule } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperComponent } from './stepper/stepper.component';
import { SecurityComponent } from './security/security.component';
import { InformationComponent } from './information/information.component';
import { FinishComponent } from './finish/finish.component';
import { ContactComponent } from './contact/contact.component';
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import { MeetingAddAgendaComponent } from './meeting-add-agenda/meeting-add-agenda.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MeetingAddTopicComponent } from './meeting-add-topic/meeting-add-topic.component';
import { MeetingComponent } from './meeting/meeting.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
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

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule, NgbPaginationModule, NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AgendaTopAdminComponent } from './agenda-top-admin/agenda-top-admin.component';
import { AgendaTopicAdminComponent } from './agenda-topic-admin/agenda-topic-admin.component';
import { MeetingSaveComponent } from './meeting-save/meeting-save.component';
import { MeetingSaveTopicComponent } from './meeting-save-topic/meeting-save-topic.component';
import { AgendaTopicListComponent } from './agenda-topic-list/agenda-topic-list.component';
import { MeetingPrepareComponent } from './meeting-prepare/meeting-prepare.component';
import { MeetingTimeManageComponent } from './meeting-time-manage/meeting-time-manage.component';
import { AgendaComponent } from './agenda/agenda.component';
import { HomeOutsiderComponent } from './home-outsider/home-outsider.component';
import { MeetingTopicComponent } from './meeting-topic/meeting-topic.component';




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
    HomeComponent,
    UsersComponent,
    PositionsComponent,
    MeetingSettingComponent,
    StepperComponent,
    SecurityComponent,
    InformationComponent,
    FinishComponent,
    ContactComponent,
    MeetingCreateComponent,
    MeetingAddAgendaComponent,
    MeetingAddTopicComponent,
    MeetingComponent,
    OutsiderComponent,
    SideMenuComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    MeetingManageComponent,
    MeetingManageTopicComponent,
    MeetingTimeComponent,
    AgendaManageComponent,
    AgencyTopicComponent,
    AgendaTopicComponent,
    AgendaTopAdminComponent,
    AgendaTopicAdminComponent,
    MeetingSaveComponent,
    MeetingSaveTopicComponent,
    AgendaTopicListComponent,
    MeetingPrepareComponent,
    MeetingTimeManageComponent,
    AgendaComponent,
    HomeOutsiderComponent,
    MeetingTopicComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxExtendedPdfViewerModule,
    NgxPaginationModule,
    CdkStepperModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    MatStepperModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatAutocompleteModule,
    AutocompleteLibModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    NgbPaginationModule, 
    NgbAlertModule,
    NgbDatepickerModule, 
    JsonPipe,
    MatIconModule

  ],
  exports:[CdkStepperModule],
  providers: [
    AuthGuard, 
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
