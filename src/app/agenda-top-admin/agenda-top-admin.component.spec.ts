import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaTopAdminComponent } from './agenda-top-admin.component';

describe('AgendaTopAdminComponent', () => {
  let component: AgendaTopAdminComponent;
  let fixture: ComponentFixture<AgendaTopAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTopAdminComponent]
    });
    fixture = TestBed.createComponent(AgendaTopAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
