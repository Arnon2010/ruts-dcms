import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaTopicComponent } from './agenda-topic.component';

describe('AgendaTopicComponent', () => {
  let component: AgendaTopicComponent;
  let fixture: ComponentFixture<AgendaTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTopicComponent]
    });
    fixture = TestBed.createComponent(AgendaTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
