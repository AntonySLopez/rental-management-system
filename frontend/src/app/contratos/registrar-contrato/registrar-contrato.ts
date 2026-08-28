import { Component, inject, OnInit } from '@angular/core';
import { PanelLateralComponent } from '../../shared/panel-lateral/panel-lateral.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ContratoService } from '../services/contrato.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PropiedadListaResponse } from '../models/propiedad.model';
import { InquilinoListaResponse } from '../models/inquilino.model';
import { LocalListaResponse } from '../models/local-lista.model';
import { CrearContratoReq, ContratoActivoResponse, ContratoDetalleResponse, RenovarContratoReq } from '../models/contrato.model';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-contrato',
  imports: [PanelLateralComponent, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './registrar-contrato.html',
  styleUrl: './registrar-contrato.css',
})
export class RegistrarContrato implements OnInit {
  private contratoService = inject(ContratoService);
  private snackBar = inject(MatSnackBar);

  contratoForm = new FormGroup({
    inquilinoId: new FormControl(''),
    propiedadId: new FormControl(''),
    localId: new FormControl(''),
    precioMensual: new FormControl(''),
    duracionMeses: new FormControl(''),
    fechaInicio: new FormControl(''),
    fechaFin: new FormControl(''),
    observacion: new FormControl(''),
    lecturaAnterior: new FormControl(''),
    garantia: new FormControl(''),
  });

  inquilinos = signal<InquilinoListaResponse[]>([]);
  propiedades = signal<PropiedadListaResponse[]>([]);
  locales = signal<LocalListaResponse[]>([]);
  contratosActivos = signal<ContratoActivoResponse[]>([]);
  contratoDetalle = signal<ContratoDetalleResponse | null>(null);

  loadingInquilinos = signal(false);
  loadingPropiedades = signal(true);
  loadingLocales = signal(false);
  loadingContratosActivos = signal(false);

  activeTab = signal<'crear' | 'renovar' | 'cerrar'>('crear');

  ngOnInit() {
    this.cargarInquilinos();
    this.cargarPropiedades();
  }

  setActiveTab(tab: 'crear' | 'renovar' | 'cerrar') {
    this.activeTab.set(tab);
    if (tab === 'renovar') {
      this.cargarContratosActivos();
    }
  }

  cargarInquilinos() {
    this.loadingInquilinos.set(true);
    this.contratoService.getListaDeInquilinos().subscribe({
      next: (response) => {
        this.inquilinos.set(response);
        this.loadingInquilinos.set(false);
      },
      error: (error) => {
        console.error('Error al cargar inquilinos:', error);
        this.loadingInquilinos.set(false);
      },
    });
  }

  onPropiedadChange() {
    const propiedadId = this.contratoForm.get('propiedadId')?.value;
    console.log('Propiedad seleccionada:', propiedadId);
    if (!propiedadId) {
      this.locales.set([]);
      return;
    }
    this.cargarLocales(Number(propiedadId));
  }

  cargarLocales(propiedadId: number) {
    this.loadingLocales.set(true);
    this.contratoService.getListaDeLocales(propiedadId).subscribe({
      next: (response) => {
        this.locales.set(response);
        this.loadingLocales.set(false);
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
        this.loadingLocales.set(false);
      },
    });
  }

  onSubmit() {
    const contrato: CrearContratoReq = {
      inquilinoId: Number(this.contratoForm.get('inquilinoId')?.value),
      localId: Number(this.contratoForm.get('localId')?.value),
      precioMensual: Number(this.contratoForm.get('precioMensual')?.value) || 0,
      duracionMeses: Number(this.contratoForm.get('duracionMeses')?.value) || 0,
      fechaInicio: this.contratoForm.get('fechaInicio')?.value || '',
      fechaFin: this.contratoForm.get('fechaFin')?.value || '',
      lecturaAnterior: Number(this.contratoForm.get('lecturaAnterior')?.value) || 0,
    };

    // Solo incluir campos opcionales si tienen valor
    const observacion = this.contratoForm.get('observacion')?.value;
    if (observacion && observacion.trim().length >= 10) {
      contrato.observacion = observacion;
    }

    const garantia = Number(this.contratoForm.get('garantia')?.value);
    if (garantia && garantia > 0) {
      contrato.garantia = garantia;
    }

    console.log(contrato);

    this.contratoService.crearContrato(contrato).subscribe({      
      next: () => {
        this.snackBar.open('Contrato creado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.contratoForm.reset();
      },
      error: (error) => {
        this.snackBar.open('Error al crear el contrato', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al crear contrato:', error);
      },
    });
  }

  cargarPropiedades() {
    this.contratoService.getListaDePropiedades().subscribe({
      next: (response) => {
        this.propiedades.set(response);
        this.loadingPropiedades.set(false);
        console.log(response);
      },
      error: (error) => {
        console.error('Error al cargar propiedades:', error);
        this.loadingPropiedades.set(false);
      },
    });
  }

  cargarContratosActivos() {
    this.loadingContratosActivos.set(true);
    this.contratoService.getListaDeContratosActivos().subscribe({
      next: (response) => {
        this.contratosActivos.set(response);
        this.loadingContratosActivos.set(false);
      },
      error: (error) => {
        console.error('Error al cargar contratos activos:', error);
        this.loadingContratosActivos.set(false);
      },
    });
  }

  seleccionarContrato(contrato: ContratoActivoResponse) {
    this.contratoService.buscarContratoPorId(contrato.id).subscribe({
      next: (detalle) => {
        this.contratoDetalle.set(detalle);
        this.cargarFormularioConDetalle(detalle);
      },
      error: (error) => {
        console.error('Error al cargar detalle del contrato:', error);
        this.snackBar.open('Error al cargar contrato', 'Cerrar', { duration: 3000 });
      },
    });
  }

  cargarFormularioConDetalle(detalle: ContratoDetalleResponse) {
    this.contratoForm.patchValue({
      inquilinoId: detalle.inquilino_id.toString(),
      localId: detalle.local_id.toString(),
      precioMensual: detalle.precio_mensual.toString(),
      duracionMeses: detalle.duracion_meses.toString(),
      fechaInicio: detalle.fecha_inicio,
      fechaFin: detalle.fecha_fin,
      observacion: detalle.observacion,
      lecturaAnterior: detalle.lectura_anterior.toString(),
      garantia: detalle.garantia ? detalle.garantia.toString() : '',
    });
  }

  volverALista() {
    this.contratoDetalle.set(null);
    this.contratoForm.reset();
  }

  onRenovarSubmit() {
    if (!this.contratoDetalle()) return;

    const renovar: RenovarContratoReq = {
      contrato_id: this.contratoDetalle()!.id,
      fecha_inicio: this.contratoForm.get('fechaInicio')?.value || '',
      fecha_fin: this.contratoForm.get('fechaFin')?.value || '',
      duracion_meses: Number(this.contratoForm.get('duracionMeses')?.value) || 0,
    };

    const observacion = this.contratoForm.get('observacion')?.value;
    if (observacion && observacion.trim().length >= 10) {
      renovar.observacion = observacion;
    }

    this.contratoService.renovarContrato(renovar).subscribe({
      next: () => {
        this.snackBar.open('Contrato renovado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.volverALista();
        this.cargarContratosActivos();
      },
      error: (error) => {
        this.snackBar.open('Error al renovar el contrato', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al renovar contrato:', error);
      },
    });
  }
}


