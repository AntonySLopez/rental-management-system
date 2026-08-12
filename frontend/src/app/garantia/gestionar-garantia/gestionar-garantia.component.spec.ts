import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarGarantiaComponent } from './gestionar-garantia.component';

describe('GestionarGarantiaComponent', () => {
  let component: GestionarGarantiaComponent;
  let fixture: ComponentFixture<GestionarGarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarGarantiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarGarantiaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
