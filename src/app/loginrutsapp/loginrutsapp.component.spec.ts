import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginrutsappComponent } from './loginrutsapp.component';

describe('LoginrutsappComponent', () => {
  let component: LoginrutsappComponent;
  let fixture: ComponentFixture<LoginrutsappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginrutsappComponent]
    });
    fixture = TestBed.createComponent(LoginrutsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
