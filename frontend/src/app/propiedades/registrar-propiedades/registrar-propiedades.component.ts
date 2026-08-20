import { Component, inject } from '@angular/core';
import { PropiedadService } from '../serices/propiedad.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { registrarPropiedadModel } from '../models/propiedad.model';
import { PanelLateralComponent } from '../../shared/panel-lateral/panel-lateral.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registrar-propiedades.component',
  imports: [ReactiveFormsModule, PanelLateralComponent],
  templateUrl: './registrar-propiedades.component.html',
  styleUrl: './registrar-propiedades.component.css',
})
export class RegistrarPropiedadesComponent {
  private propiedadService = inject(PropiedadService);
  private snackBar = inject(MatSnackBar);

  onSubmitProperty() {
    const data = this.nuevaPropiedadForm.value;
    console.log(data);
    this.propiedadService.registrarPropiedad(data as registrarPropiedadModel).subscribe({
      next: () => {
        this.snackBar.open('¡Propiedad registrada exitosamente!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        console.log('Propiedad registrada correctamente');
      },
      error: (error) => {
        this.snackBar.open('Error al registrar la propiedad', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Error al registrar la propiedad', error);
      }
    });
  }

  nuevaPropiedadForm = new FormGroup({
    nombre: new FormControl(''),
    direccion: new FormControl(''),
    descripcion: new FormControl(''),
  });

}
