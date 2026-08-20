import { TestBed } from '@angular/core/testing';

import { ContratoRepository } from './contrato.repository';

describe('ContratoRepository', () => {
  let service: ContratoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContratoRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
