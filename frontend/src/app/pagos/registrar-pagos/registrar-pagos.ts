import { Component, inject, OnInit } from '@angular/core';
import { PanelLateralComponent } from '../../shared/panel-lateral/panel-lateral.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContratoActivoResponse, RegistrarPagoReq } from '../models/pago.model';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-pagos',
  imports: [PanelLateralComponent, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './registrar-pagos.html',
  styleUrl: './registrar-pagos.css',
})
export class RegistrarPagos implements OnInit {
  private pagoService = inject(PagoService);
  private snackBar = inject(MatSnackBar);

  contratosActivos = signal<ContratoActivoResponse[]>([]);
  contratoSeleccionado = signal<ContratoActivoResponse | null>(null);
  loadingContratos = signal(false);

  pagoForm = new FormGroup({
    monto: new FormControl(''),
    metodoPago: new FormControl(''),
    referencia: new FormControl(''),
    descripcion: new FormControl(''),
  });

  ngOnInit() {
    this.cargarContratos();
  }

  cargarContratos() {
    this.loadingContratos.set(true);
    this.pagoService.getListaDeContratosActivos().subscribe({
      next: (response) => {
        this.contratosActivos.set(response);
        this.loadingContratos.set(false);
      },
      error: (error) => {
        console.error('Error al cargar contratos:', error);
        this.snackBar.open('Error al cargar contratos', 'Cerrar', { duration: 3000 });
        this.loadingContratos.set(false);
      },
    });
  }

  seleccionarContrato(contrato: ContratoActivoResponse) {
    this.contratoSeleccionado.set(contrato);
    // Pre-llenar el monto con el precio mensual del contrato
    this.pagoForm.patchValue({
      monto: contrato.precio_mensual,
    });
  }

  volverALista() {
    this.contratoSeleccionado.set(null);
    this.pagoForm.reset();
  }

  onSubmit() {
    if (!this.contratoSeleccionado()) return;

    const pago: RegistrarPagoReq = {
      contratoId: this.contratoSeleccionado()!.id,
      monto: Number(this.pagoForm.get('monto')?.value) || 0,
      metodoPago: this.pagoForm.get('metodoPago')?.value || '',
    };

    const referencia = this.pagoForm.get('referencia')?.value;
    if (referencia && referencia.trim().length > 0) {
      pago.referencia = referencia;
    }

    const descripcion = this.pagoForm.get('descripcion')?.value;
    if (descripcion && descripcion.trim().length > 0) {
      pago.descripcion = descripcion;
    }

    this.pagoService.registrarPago(pago).subscribe({
      next: () => {
        this.snackBar.open('Pago registrado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.volverALista();
        this.cargarContratos();
      },
      error: (error) => {
        this.snackBar.open('Error al registrar el pago', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al registrar pago:', error);
      },
    });
  }
}
