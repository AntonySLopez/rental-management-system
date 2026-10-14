import z from "zod";

// DTO de entrada según B7
export const actualizarInquilinoSchema = z.object({
    id: z.coerce.number().int().min(1),
    nombre: z.string().min(1).max(200).transform(val => val.trim()).optional(),
    telefono: z.string().regex(/^\d{9}$/).optional(),
    email: z.string().email().max(100).optional(),
    documento: z.string().regex(/^\d{8}$/),
});

export type ActualizarInquilinoDto = z.infer<typeof actualizarInquilinoSchema>;

// DTO de salida según B7
export interface ActualizarInquilinoResponse {
    id: string;
}
