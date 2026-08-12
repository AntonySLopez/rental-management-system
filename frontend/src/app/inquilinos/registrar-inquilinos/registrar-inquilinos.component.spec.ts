import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarInquilinosComponent } from './registrar-inquilinos.component';

describe('RegistrarInquilinosComponent', () => {
  let component: RegistrarInquilinosComponent;
  let fixture: ComponentFixture<RegistrarInquilinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarInquilinosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarInquilinosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
