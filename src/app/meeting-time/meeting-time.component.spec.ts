import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTimeComponent } from './meeting-time.component';

describe('MeetingTimeComponent', () => {
  let component: MeetingTimeComponent;
  let fixture: ComponentFixture<MeetingTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingTimeComponent]
    });
    fixture = TestBed.createComponent(MeetingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
