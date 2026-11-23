import z from "zod";

// DTO de entrada según B7
export const listarCuotasSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
});

export type ListarCuotasDto = z.infer<typeof listarCuotasSchema>;
