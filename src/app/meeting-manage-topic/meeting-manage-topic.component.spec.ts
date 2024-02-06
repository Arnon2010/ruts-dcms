import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingManageTopicComponent } from './meeting-manage-topic.component';

describe('MeetingManageTopicComponent', () => {
  let component: MeetingManageTopicComponent;
  let fixture: ComponentFixture<MeetingManageTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingManageTopicComponent]
    });
    fixture = TestBed.createComponent(MeetingManageTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
