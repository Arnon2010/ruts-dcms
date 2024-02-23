import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTopicComponent } from './meeting-topic.component';

describe('MeetingTopicComponent', () => {
  let component: MeetingTopicComponent;
  let fixture: ComponentFixture<MeetingTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingTopicComponent]
    });
    fixture = TestBed.createComponent(MeetingTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
