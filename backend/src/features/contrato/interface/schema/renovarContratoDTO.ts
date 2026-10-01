import z from "zod";

export const renovarContratoSchema = z.object({
    contrato_id: z.number().int("El id del contrato es requerido"),
    fecha_inicio: z.string("La fecha de inicio es requerida"),
    fecha_fin: z.string("La fecha de fin es requerida"),
    duracion_meses: z.number().int("La duración en meses es requerida"),
    observacion: z.string().optional(),
});

export type RenovarContratoDTO = z.infer<typeof renovarContratoSchema>;