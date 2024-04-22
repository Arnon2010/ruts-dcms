import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyComponent } from './certify.component';

describe('CertifyComponent', () => {
  let component: CertifyComponent;
  let fixture: ComponentFixture<CertifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertifyComponent]
    });
    fixture = TestBed.createComponent(CertifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
