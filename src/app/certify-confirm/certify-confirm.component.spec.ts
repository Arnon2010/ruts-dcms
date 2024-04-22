import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyConfirmComponent } from './certify-confirm.component';

describe('CertifyConfirmComponent', () => {
  let component: CertifyConfirmComponent;
  let fixture: ComponentFixture<CertifyConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertifyConfirmComponent]
    });
    fixture = TestBed.createComponent(CertifyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
