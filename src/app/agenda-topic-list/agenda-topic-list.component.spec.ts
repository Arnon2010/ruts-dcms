import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaTopicListComponent } from './agenda-topic-list.component';

describe('AgendaTopicListComponent', () => {
  let component: AgendaTopicListComponent;
  let fixture: ComponentFixture<AgendaTopicListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTopicListComponent]
    });
    fixture = TestBed.createComponent(AgendaTopicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
