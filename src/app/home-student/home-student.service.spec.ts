import { TestBed } from '@angular/core/testing';

import { HomeStudentService } from './home-student.service';

describe('HomeStudentService', () => {
  let service: HomeStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
