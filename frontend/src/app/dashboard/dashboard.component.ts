import { Component } from '@angular/core';
import { PanelLateralComponent } from '../shared/panel-lateral/panel-lateral.component';

@Component({
  selector: 'app-dashboard.component',
  imports: [PanelLateralComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
