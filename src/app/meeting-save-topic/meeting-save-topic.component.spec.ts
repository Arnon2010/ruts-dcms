import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSaveTopicComponent } from './meeting-save-topic.component';

describe('MeetingSaveTopicComponent', () => {
  let component: MeetingSaveTopicComponent;
  let fixture: ComponentFixture<MeetingSaveTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingSaveTopicComponent]
    });
    fixture = TestBed.createComponent(MeetingSaveTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
