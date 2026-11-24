import { z } from "zod";

// DTO de entrada según B7 para Caso de uso #22
export const listarConsumosSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo")
});

export type ListarConsumosDto = z.infer<typeof listarConsumosSchema>;

