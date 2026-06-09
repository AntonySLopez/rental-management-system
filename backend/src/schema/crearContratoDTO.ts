import z from "zod";

export const crearContratoSchema = z.object({
    inquilinoId: z.number().int("El id del inquilino es requerido"),
    localId: z.number().int("El id del local es requerido"),
    precioMensual: z.number().positive("El precio mensual es requerido"),
    duracionMeses: z.number().int().positive("La duración en meses debe ser un número positivo"),
    fechaInicio: z.string("La fecha de inicio es requerida"),
    fechaFin: z.string("La fecha de fin es requerida"),
    observacion: z.string().min(10).max(200).optional(),
    lecturaAnterior: z.number().positive("La lectura anterior es requerida"),
    garantia: z.number().positive("La garantia es requerida").optional(),
});

export type CrearContratoDTO = z.infer<typeof crearContratoSchema>;