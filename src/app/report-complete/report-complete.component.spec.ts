import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCompleteComponent } from './report-complete.component';

describe('ReportCompleteComponent', () => {
  let component: ReportCompleteComponent;
  let fixture: ComponentFixture<ReportCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportCompleteComponent]
    });
    fixture = TestBed.createComponent(ReportCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
