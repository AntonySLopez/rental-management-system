import { Component } from '@angular/core';
import { PanelLateralComponent } from '../shared/panel-lateral/panel-lateral.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard.component',
  imports: [PanelLateralComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
