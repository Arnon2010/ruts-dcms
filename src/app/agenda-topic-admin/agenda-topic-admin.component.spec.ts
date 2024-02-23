import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaTopicAdminComponent } from './agenda-topic-admin.component';

describe('AgendaTopicAdminComponent', () => {
  let component: AgendaTopicAdminComponent;
  let fixture: ComponentFixture<AgendaTopicAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTopicAdminComponent]
    });
    fixture = TestBed.createComponent(AgendaTopicAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
