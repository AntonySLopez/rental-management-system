import z from "zod";

// DTO de entrada según B7
export const detalleInquilinoSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export type DetalleInquilinoDto = z.infer<typeof detalleInquilinoSchema>;

// DTO de salida según B7
export interface DetalleInquilinoResponse {
    id: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
    documento: string;
    fecha_registro: string;
    estado: string;
}
