import z from "zod";

// DTO de entrada según B7
export const nuevoContratoSchema = z.object({
    inquilino_id: z.coerce.number().int().min(1),
    local_id: z.coerce.number().int().min(1),
    precio_mensual: z.number()
        .positive("El precio mensual debe ser mayor que 0")
        .refine(val => Number.isInteger(val * 100), "El precio mensual puede tener máximo 2 decimales"),
    garantia: z.number()
        .positive("La garantía debe ser mayor que 0")
        .refine(val => Number.isInteger(val * 100), "La garantía puede tener máximo 2 decimales")
        .optional(),
    lectura_inicial_luz: z.number()
        .min(0, "La lectura inicial de luz debe ser mayor o igual a 0")
        .refine(val => Number.isInteger(val * 100), "La lectura inicial de luz puede tener máximo 2 decimales"),
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha debe ser YYYY-MM-DD"),
    duracion_meses: z.number().int().min(1, "La duración debe ser al menos 1 mes"),
    observaciones: z.string()
        .max(255, "Las observaciones no pueden exceder 255 caracteres")
        .optional(),
    metodo_pago: z.enum(['efectivo', 'transferencia', 'deposito_bancario']),
    referencia: z.string()
        .max(100, "La referencia no puede exceder 100 caracteres")
        .optional(),
});

export type NuevoContratoDto = z.infer<typeof nuevoContratoSchema>;
