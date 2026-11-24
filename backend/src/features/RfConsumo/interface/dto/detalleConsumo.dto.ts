import { z } from "zod";

// DTO de entrada según B7 para Caso de uso #23
export const detalleConsumoSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    id: z.number().int().positive("El id del consumo debe ser un entero positivo")
});

export type DetalleConsumoDto = z.infer<typeof detalleConsumoSchema>;
