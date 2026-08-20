import { TestBed } from '@angular/core/testing';

import { LocalRepository } from './local.repository';

describe('LocalRepository', () => {
  let service: LocalRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
