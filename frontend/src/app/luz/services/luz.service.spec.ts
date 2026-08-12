import { TestBed } from '@angular/core/testing';

import { LuzService } from './luz.service';

describe('LuzService', () => {
  let service: LuzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
