import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTimeManageComponent } from './meeting-time-manage.component';

describe('MeetingTimeManageComponent', () => {
  let component: MeetingTimeManageComponent;
  let fixture: ComponentFixture<MeetingTimeManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingTimeManageComponent]
    });
    fixture = TestBed.createComponent(MeetingTimeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
