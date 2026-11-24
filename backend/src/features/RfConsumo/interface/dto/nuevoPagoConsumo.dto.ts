import { z } from "zod";

// DTO de entrada según B7 para Caso de uso #24
export const nuevoPagoConsumoSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    id: z.number().int().positive("El id del consumo debe ser un entero positivo"),
    monto: z
        .number()
        .positive("El monto debe ser positivo")
        .max(1000, "El monto máximo es 1000.00")
        .refine(val => Number.isInteger(Math.round(val * 100)), "El monto debe tener máximo 2 decimales"),
    metodo_pago: z.enum(['efectivo', 'transferencia', 'deposito_bancario']),
    referencia: z.string().max(100, "La referencia debe tener máximo 100 caracteres").optional(),
    observaciones: z.string().max(255, "Las observaciones deben tener máximo 255 caracteres").optional()
});

export type NuevoPagoConsumoDto = z.infer<typeof nuevoPagoConsumoSchema>;
