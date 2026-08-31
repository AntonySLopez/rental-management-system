import { Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GarantiaService } from '../services/garantia.service';
import {
  GestionarGarantiaReq,
  GarantiaActivaResponse,
  GarantiaDetalleResponse,
} from '../models/garantia.model';
import { PanelLateralComponent } from '../../shared/panel-lateral/panel-lateral.component';

@Component({
  selector: 'app-gestionar-garantia.component',
  imports: [PanelLateralComponent],
  templateUrl: './gestionar-garantia.component.html',
  styleUrl: './gestionar-garantia.component.css',
})
export class GestionarGarantiaComponent {
  private readonly garantiaService = inject(GarantiaService);
  private readonly snackBar = inject(MatSnackBar);

  garantiasActivas = signal<GarantiaActivaResponse[]>([]);
  garantiaSeleccionada = signal<GarantiaDetalleResponse | null>(null);
  loadingGarantias = signal<boolean>(true);

  isReturnModalOpen = signal<boolean>(false);
  isApplyToDebtModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.cargarGarantiasRetenidas();
  }

  cargarGarantiasRetenidas() {
    this.loadingGarantias.set(true);
    this.garantiaService.listaGarantiasRetenidas().subscribe({
      next: (response) => {
        this.garantiasActivas.set(response);
        this.loadingGarantias.set(false);
      },
      error: (error) => {
        console.error('Error al cargar garantías retenidas:', error);
        this.loadingGarantias.set(false);
      },
    });
  }

  seleccionarGarantia(garantiaId: number) {
    this.garantiaService.obtenerGarantiaDetallada(garantiaId).subscribe({
      next: (response) => {
        this.garantiaSeleccionada.set(response);
      },
      error: (error) => {
        console.error('Error al buscar garantía:', error);
        this.snackBar.open('Error al cargar garantía', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  volverALista() {
    this.garantiaSeleccionada.set(null);
  }

  openReturnModal() {
    this.isReturnModalOpen.set(true);
  }

  closeReturnModal() {
    this.isReturnModalOpen.set(false);
  }

  openApplyToDebtModal() {
    this.isApplyToDebtModalOpen.set(true);
  }

  closeApplyToDebtModal() {
    this.isApplyToDebtModalOpen.set(false);
  }

  confirmWarrantyReturn() {
    if (!this.garantiaSeleccionada()) return;

    const req: GestionarGarantiaReq = {
      contrato_id: this.garantiaSeleccionada()!.contrato_id,
      tipo_operacion: 'devolver',
    };

    this.garantiaService.devolverGarantia(req).subscribe({
      next: () => {
        this.snackBar.open('Garantía devuelta correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.closeReturnModal();
        this.volverALista();
        this.cargarGarantiasRetenidas();
      },
      error: (error) => {
        console.error('Error al devolver garantía:', error);
        this.snackBar.open('Error al devolver garantía', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  confirmApplyToDebt() {
    if (!this.garantiaSeleccionada()) return;

    const req: GestionarGarantiaReq = {
      contrato_id: this.garantiaSeleccionada()!.contrato_id,
      tipo_operacion: 'aplicar',
    };

    this.garantiaService.aplicarGarantia(req).subscribe({
      next: () => {
        this.snackBar.open('Garantía aplicada a deuda correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.closeApplyToDebtModal();
        this.volverALista();
        this.cargarGarantiasRetenidas();
      },
      error: (error) => {
        console.error('Error al aplicar garantía:', error);
        this.snackBar.open('Error al aplicar garantía', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
