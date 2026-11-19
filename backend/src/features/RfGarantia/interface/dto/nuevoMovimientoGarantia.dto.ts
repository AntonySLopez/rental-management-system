import z from "zod";

// DTO de entrada según B7
export const nuevoMovimientoGarantiaSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    monto: z.number().positive("El monto debe ser positivo").refine(val => Number.isInteger(val * 100), "El monto debe tener máximo 2 decimales").max(10000, "El monto máximo es 10000"),
    metodo_pago: z.enum(['efectivo', 'transferencia', 'deposito_bancario']),
    referencia: z.string().max(100, "La referencia debe tener máximo 100 caracteres").optional(),
    tipo_accion: z.enum(['deposito', 'devuelta', 'consumida']),
    observaciones: z.string().max(255, "Las observaciones deben tener máximo 255 caracteres").optional(),
});

export type NuevoMovimientoGarantiaDto = z.infer<typeof nuevoMovimientoGarantiaSchema>;
