import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOutsiderComponent } from './home-outsider.component';

describe('HomeOutsiderComponent', () => {
  let component: HomeOutsiderComponent;
  let fixture: ComponentFixture<HomeOutsiderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeOutsiderComponent]
    });
    fixture = TestBed.createComponent(HomeOutsiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
