import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPagos } from './registrar-pagos';

describe('RegistrarPagos', () => {
  let component: RegistrarPagos;
  let fixture: ComponentFixture<RegistrarPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPagos],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPagos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
