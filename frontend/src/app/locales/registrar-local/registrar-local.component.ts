import { Component, inject } from '@angular/core';
import { PanelLateralComponent } from '../../shared/panel-lateral/panel-lateral.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { LocalServices } from '../services/local.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalRegistrarReq } from '../models/local.model';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { OnInit } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-registrar-local.component',
  imports: [PanelLateralComponent, ReactiveFormsModule],
  templateUrl: './registrar-local.component.html',
  styleUrl: './registrar-local.component.css',
})
export class RegistrarLocalComponent implements OnInit {
  private localServices = inject(LocalServices);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getListaDePropiedades();
  }
  loadingProperties = signal(true);
  propiedades = signal<PropiedadListaResponse[]>([]);

  LocalForm = new FormGroup({
    propiedadId: new FormControl(''),
    nombreLocal: new FormControl(''),
    descripcion: new FormControl(''),
    area: new FormControl(''),
  });

 

  onSubmit() {

    const nuevoLocal: LocalRegistrarReq = {
      propiedadId: Number(this.LocalForm.get('propiedadId')?.value),
      nombreLocal: this.LocalForm.get('nombreLocal')?.value || '',
      descripcion: this.LocalForm.get('descripcion')?.value || '',
      area: Number(this.LocalForm.get('area')?.value) || 0,
    };
    console.log(nuevoLocal);
    
    this.localServices.registrarLocal(nuevoLocal).subscribe({
      next: () => {
        this.snackBar.open('Local registrado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.LocalForm.reset();
      },
      error: (error) => {
        this.snackBar.open('Error al registrar el local', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al registrar el local:', error);
      },
    });
  }

  getListaDePropiedades() {
    this.localServices.listaDeLocales().subscribe({
      next: (response) => {
        this.propiedades.set(response);
        this.loadingProperties.set(false);
        console.log(response);        
      },
      error: (error) => {
        this.loadingProperties.set(false);
        console.error('Error al listar las propiedades:', error);
      },
    });
  }

}
