import z from "zod";

export const registrarPagoSchema = z.object({
    contratoId: z.number().int().positive(),
    monto: z.number().positive("El monto debe ser un numero positivo"),
    metodoPago: z.string().min(4, "El metodo de pago debe tener al menos 4 caracteres"),
    referencia: z.string().optional(),
    descripcion: z.string().optional(),
});

export type RegistrarPagoDTO = z.infer<typeof registrarPagoSchema>;
