import { TestBed } from '@angular/core/testing';

import { PropiedadRepository } from './propiedad.repository';

describe('PropiedadRepository', () => {
  let service: PropiedadRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropiedadRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
