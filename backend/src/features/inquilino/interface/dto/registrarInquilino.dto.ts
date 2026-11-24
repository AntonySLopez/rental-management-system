import z from "zod";

// DTO de entrada según B7
export const nuevoInquilinoSchema = z.object({
    nombre: z.string()
        .min(1, "El nombre no puede estar vacío")
        .max(200, "El nombre no puede exceder 200 caracteres")
        .transform(val => val.trim()),
    telefono: z.string()
        .regex(/^\d{9}$/, "El teléfono debe tener exactamente 9 dígitos")
        .optional(),
    email: z.string()
        .email("El email debe ser válido")
        .max(100, "El email no puede exceder 100 caracteres")
        .optional(),
    documento: z.string()
        .regex(/^\d{8}$/, "El documento debe tener exactamente 8 dígitos"),
});

export type NuevoInquilinoDto = z.infer<typeof nuevoInquilinoSchema>;

// DTO de salida según B7
export interface NuevoInquilinoResponse {
    id: string;
}
