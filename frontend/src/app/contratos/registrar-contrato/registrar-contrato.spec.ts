import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarContrato } from './registrar-contrato';

describe('RegistrarContrato', () => {
  let component: RegistrarContrato;
  let fixture: ComponentFixture<RegistrarContrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarContrato],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarContrato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
