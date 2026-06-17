import z from "zod";

export const gestionarGarantiaSchema = z.object({
    contrato_id: z.number().int("El id del contrato es requerido"),
    tipo_operacion: z.string().min(1, "El tipo de operación es requerido"),
});

export type GestionarGarantiaDTO = z.infer<typeof gestionarGarantiaSchema>;