import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAllComponent } from './meeting-all.component';

describe('MeetingAllComponent', () => {
  let component: MeetingAllComponent;
  let fixture: ComponentFixture<MeetingAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAllComponent]
    });
    fixture = TestBed.createComponent(MeetingAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
