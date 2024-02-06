import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyTopicComponent } from './agency-topic.component';

describe('AgencyTopicComponent', () => {
  let component: AgencyTopicComponent;
  let fixture: ComponentFixture<AgencyTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyTopicComponent]
    });
    fixture = TestBed.createComponent(AgencyTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
