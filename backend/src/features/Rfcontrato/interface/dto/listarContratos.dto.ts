import z from "zod";

// DTO de entrada según B7
export const listarContratosSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListarContratosDto = z.infer<typeof listarContratosSchema>;
