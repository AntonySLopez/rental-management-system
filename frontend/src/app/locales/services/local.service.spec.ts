import { TestBed } from '@angular/core/testing';

import { LocalServices } from './local.service';

describe('LocalServices', () => {
  let service: LocalServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
