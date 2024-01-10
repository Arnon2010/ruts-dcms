import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAddAgendaComponent } from './meeting-add-agenda.component';

describe('MeetingAddAgendaComponent', () => {
  let component: MeetingAddAgendaComponent;
  let fixture: ComponentFixture<MeetingAddAgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAddAgendaComponent]
    });
    fixture = TestBed.createComponent(MeetingAddAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
