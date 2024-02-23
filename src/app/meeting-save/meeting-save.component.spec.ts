import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSaveComponent } from './meeting-save.component';

describe('MeetingSaveComponent', () => {
  let component: MeetingSaveComponent;
  let fixture: ComponentFixture<MeetingSaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingSaveComponent]
    });
    fixture = TestBed.createComponent(MeetingSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
