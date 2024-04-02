import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCertifyComponent } from './report-certify.component';

describe('ReportCertifyComponent', () => {
  let component: ReportCertifyComponent;
  let fixture: ComponentFixture<ReportCertifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportCertifyComponent]
    });
    fixture = TestBed.createComponent(ReportCertifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
