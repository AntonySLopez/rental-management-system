import z from "zod";

// DTO de entrada según B7
export const nuevoPagoAlquilerSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    cuota_id: z.number().int().positive("El cuota_id debe ser un entero positivo"),
    monto: z.number().positive("El monto debe ser positivo").refine(val => Number.isInteger(val * 100), "El monto debe tener máximo 2 decimales").max(10000, "El monto máximo es 10000"),
    metodo_pago: z.enum(['efectivo', 'transferencia', 'deposito_bancario']),
    referencia: z.string().max(100, "La referencia debe tener máximo 100 caracteres").optional(),
    observaciones: z.string().max(255, "Las observaciones deben tener máximo 255 caracteres").optional(),
});

export type NuevoPagoAlquilerDto = z.infer<typeof nuevoPagoAlquilerSchema>;
