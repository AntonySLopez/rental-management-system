import z from "zod";

export const cerrarContratoSchema = z.object({
    contrato_id: z.number(),
});

export type CerrarContratoDTO = z.infer<typeof cerrarContratoSchema>;