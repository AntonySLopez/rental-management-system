import { z } from "zod";

export const consultarDeudaDTOSchema = z.object({
    contratoId: z.number().int().positive(),
});

export type ConsultarDeudaDTO = z.infer<typeof consultarDeudaDTOSchema>;