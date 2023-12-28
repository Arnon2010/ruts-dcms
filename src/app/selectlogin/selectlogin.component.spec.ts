import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectloginComponent } from './selectlogin.component';

describe('SelectloginComponent', () => {
  let component: SelectloginComponent;
  let fixture: ComponentFixture<SelectloginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectloginComponent]
    });
    fixture = TestBed.createComponent(SelectloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
