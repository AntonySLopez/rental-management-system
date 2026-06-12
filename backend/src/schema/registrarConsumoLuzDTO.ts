import z from "zod";

export const registrarConsumoLuzSchema = z.object({
    contratoId: z.number().int("El id del contrato es requerido"),
    lecturaAnterior: z.number().positive("La lectura anterior es requerida"),
    lecturaActual: z.number().positive("La lectura actual es requerida"),
    precioKwh: z.number().positive("El precio por kWh es requerido"),
    alumbradoPublico: z.number().positive("El alumbrado público es requerido"),
});

export type RegistrarConsumoLuzDTO = z.infer<typeof registrarConsumoLuzSchema>;