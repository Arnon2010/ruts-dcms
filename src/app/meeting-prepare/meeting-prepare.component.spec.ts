import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPrepareComponent } from './meeting-prepare.component';

describe('MeetingPrepareComponent', () => {
  let component: MeetingPrepareComponent;
  let fixture: ComponentFixture<MeetingPrepareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingPrepareComponent]
    });
    fixture = TestBed.createComponent(MeetingPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
