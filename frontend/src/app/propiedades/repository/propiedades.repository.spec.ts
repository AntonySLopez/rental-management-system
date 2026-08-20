import { TestBed } from '@angular/core/testing';

import { PropiedadesRepository } from './propiedades.repository';

describe('PropiedadesRepository', () => {
  let service: PropiedadesRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropiedadesRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
