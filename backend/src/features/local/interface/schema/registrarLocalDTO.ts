import z from "zod";

export const registrarLocalSchema = z.object({
    propiedadId: z.number().int().positive(),
    nombreLocal: z.string().min(1, "El nombre del local es requerido"),
    descripcion: z.string().min(1, "La descripcion es requerida"),
    area: z.number().positive("El area debe ser un numero positivo")
});

export type RegistrarLocalDTO = z.infer<typeof registrarLocalSchema>;