import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAddTopicComponent } from './meeting-add-topic.component';

describe('MeetingAddTopicComponent', () => {
  let component: MeetingAddTopicComponent;
  let fixture: ComponentFixture<MeetingAddTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAddTopicComponent]
    });
    fixture = TestBed.createComponent(MeetingAddTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
