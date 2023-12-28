import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaculutyWebManagementComponent } from './faculuty-web-management.component';

describe('FaculutyWebManagementComponent', () => {
  let component: FaculutyWebManagementComponent;
  let fixture: ComponentFixture<FaculutyWebManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaculutyWebManagementComponent]
    });
    fixture = TestBed.createComponent(FaculutyWebManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
