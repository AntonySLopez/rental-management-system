import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarConsumoComponent } from './registrar-consumo.component';

describe('RegistrarConsumoComponent', () => {
  let component: RegistrarConsumoComponent;
  let fixture: ComponentFixture<RegistrarConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarConsumoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarConsumoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
