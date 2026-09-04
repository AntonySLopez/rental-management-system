import { Component, inject, OnInit, signal } from '@angular/core';
import { LuzService } from '../services/luz.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LuzModel } from '../models/luz.model';

@Component({
  selector: 'app-registrar-consumo.component',
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-consumo.component.html',
  styleUrl: './registrar-consumo.component.css',
})
export class RegistrarConsumoComponent implements OnInit {
  private luzService = inject(LuzService);
  private fb = inject(FormBuilder);

  vista = signal<'lista' | 'formulario'>('lista');
  locales = signal<any[]>([]);
  loadingLocales = signal(false);
  errorLocales = signal<string | null>(null);

  contratoSeleccionado = signal<any>(null);
  loadingContrato = signal(false);
  errorContrato = signal<string | null>(null);

  consumptionForm!: FormGroup;

  ngOnInit() {
    this.cargarLocales();
  }

  cargarLocales() {
    this.loadingLocales.set(true);
    this.errorLocales.set(null);
    this.luzService.findAllLocales().subscribe({
      next: (data) => {
        this.locales.set(data);
        this.loadingLocales.set(false);
      },
      error: (err) => {
        console.error('Error al cargar locales:', err);
        this.errorLocales.set('Error al cargar los locales');
        this.loadingLocales.set(false);
      }
    });
  }

  seleccionarLocal(local: any) {
    this.loadingContrato.set(true);
    this.errorContrato.set(null);

    this.luzService.buscarContratoPorLocalId(local.local_id).subscribe({
      next: (contrato) => {
        if (contrato) {
          console.log(contrato);
          this.contratoSeleccionado.set(contrato);
          this.initForm();
          this.vista.set('formulario');
          this.consumptionForm.patchValue({
            previousReading: contrato.lectura_anterior || 0,
            startDate: this.formatDate(contrato.fecha_inicio)
          });
        } else {
          this.errorContrato.set('No se encontró un contrato para este local');
        }
        this.loadingContrato.set(false);
      },
      error: (err) => {
        console.error('Error al buscar contrato:', err);
        this.errorContrato.set('Error al buscar el contrato del local');
        this.loadingContrato.set(false);
      }
    });
  }

  private initForm() {
    this.consumptionForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      previousReading: [{ value: 0, disabled: true }, Validators.required],
      currentReading: [0, [Validators.required, Validators.min(0)]],
      kwhPrice: [0, [Validators.required, Validators.min(0)]],
      publicLightingFee: [0, [Validators.required, Validators.min(0)]]
    });
  }

  volverALista() {
    this.vista.set('lista');
    this.contratoSeleccionado.set(null);
    this.errorContrato.set(null);
    this.consumptionForm.reset();
  }

  registrarConsumo() {

    const formValues = this.consumptionForm.value;
    const consumoData: LuzModel = {
      contratoId: this.contratoSeleccionado()?.contrato_id, // Necesitamos el contrato_id
      lecturaAnterior: this.contratoSeleccionado()?.lectura_anterior || 0,
      lecturaActual: formValues.currentReading,
      precioKwh: formValues.kwhPrice,
      alumbradoPublico: formValues.publicLightingFee
    };

    console.log('consumoData:', consumoData);

    this.luzService.registrarConsumo(consumoData).subscribe({
      next: (response) => {
        console.log('Consumo registrado:', response);
        alert('Consumo registrado correctamente');
        this.volverALista();
      },
      error: (err) => {
        console.error('Error al registrar consumo:', err);
        alert('Error al registrar el consumo');
      }
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
