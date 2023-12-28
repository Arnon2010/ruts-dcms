import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFacComponent } from './navbar-fac.component';

describe('NavbarFacComponent', () => {
  let component: NavbarFacComponent;
  let fixture: ComponentFixture<NavbarFacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarFacComponent]
    });
    fixture = TestBed.createComponent(NavbarFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
