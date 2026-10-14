import z from "zod";

// DTO de entrada según B7
export const listarInquilinosSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListarInquilinosDto = z.infer<typeof listarInquilinosSchema>;

// DTO de salida según B7
export interface InquilinoItem {
    id: string;
    nombre: string;
    telefono: string | null;
    documento: string;
    estado: string;
}

export interface ListarInquilinosResponse {
    data: InquilinoItem[];
    total: number;
    page: number;
    limit: number;
}
