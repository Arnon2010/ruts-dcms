import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyCapconfirmComponent } from './faculty-capconfirm.component';

describe('FacultyCapconfirmComponent', () => {
  let component: FacultyCapconfirmComponent;
  let fixture: ComponentFixture<FacultyCapconfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyCapconfirmComponent]
    });
    fixture = TestBed.createComponent(FacultyCapconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
