import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPropiedadesComponent } from './registrar-propiedades.component/registrar-propiedades.component';

describe('RegistrarPropiedadesComponent', () => {
  let component: RegistrarPropiedadesComponent;
  let fixture: ComponentFixture<RegistrarPropiedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPropiedadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPropiedadesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
