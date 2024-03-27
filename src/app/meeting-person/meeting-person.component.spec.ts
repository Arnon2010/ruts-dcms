import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPersonComponent } from './meeting-person.component';

describe('MeetingPersonComponent', () => {
  let component: MeetingPersonComponent;
  let fixture: ComponentFixture<MeetingPersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingPersonComponent]
    });
    fixture = TestBed.createComponent(MeetingPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
