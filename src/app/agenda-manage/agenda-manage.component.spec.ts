import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaManageComponent } from './agenda-manage.component';

describe('AgendaManageComponent', () => {
  let component: AgendaManageComponent;
  let fixture: ComponentFixture<AgendaManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaManageComponent]
    });
    fixture = TestBed.createComponent(AgendaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
