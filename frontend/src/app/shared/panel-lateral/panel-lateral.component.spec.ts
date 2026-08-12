import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLateralComponent } from './panel-lateral.component';

describe('PanelLateralComponent', () => {
  let component: PanelLateralComponent;
  let fixture: ComponentFixture<PanelLateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelLateralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelLateralComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
