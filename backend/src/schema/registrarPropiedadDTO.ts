import z from "zod";

export const registrarPropiedadSchema = z.object({
    nombre: z.string().min(4, "El nombre debe tener al menos 3 caracteres"),
    direccion:z.string().min(10, "La direccion debe tener al menos 10 caracteres"),
    descripcion: z.string().min(10, "La descripcion debe tener al menos 10 caracteres"),
});

export type RegistrarPropiedadDTO = z.infer<typeof registrarPropiedadSchema>