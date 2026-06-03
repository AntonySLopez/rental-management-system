import z from "zod";

export const registrarInquilinoSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    telefono: z.string().min(9, "El telefono debe tener al menos 9 caracteres").optional(),
    email: z.string().email("El email debe ser válido").optional(),
    documento: z.string().min(1, "El documento es requerido"),
});

export type RegistrarInquilinoDTO = z.infer<typeof registrarInquilinoSchema>;