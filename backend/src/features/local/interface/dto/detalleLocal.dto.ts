import z from "zod";

// DTO de entrada según B7
export const detalleLocalSchema = z.object({
    id: z.coerce.number().int().min(1),
});

export type DetalleLocalDto = z.infer<typeof detalleLocalSchema>;
