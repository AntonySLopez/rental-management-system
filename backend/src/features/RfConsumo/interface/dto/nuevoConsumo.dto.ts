import { z } from "zod";

// DTO de entrada según B7 para Caso de uso #21
export const nuevoConsumoSchema = z.object({
    contrato_id: z.number().int().positive("El contrato_id debe ser un entero positivo"),
    fecha_inicio: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha_inicio inválido (YYYY-MM-DD)")
        .refine(val => !isNaN(Date.parse(val)), "fecha_inicio debe ser una fecha válida"),
    fecha_fin: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha_fin inválido (YYYY-MM-DD)")
        .refine(val => !isNaN(Date.parse(val)), "fecha_fin debe ser una fecha válida"),
    lectura_anterior: z
        .number()
        .min(0, "La lectura anterior debe ser mayor o igual a 0")
        .max(10000, "La lectura anterior no puede superar 10000.00")
        .refine(val => Number.isInteger(Math.round(val * 100)), "La lectura anterior debe tener máximo 2 decimales"),
    lectura_actual: z
        .number()
        .min(0, "La lectura actual debe ser mayor o igual a 0")
        .max(10000, "La lectura actual no puede superar 10000.00")
        .refine(val => Number.isInteger(Math.round(val * 100)), "La lectura actual debe tener máximo 2 decimales"),
    precio_kwh: z
        .number()
        .positive("El precio_kwh debe ser mayor que 0")
        .max(10, "El precio_kwh no puede superar 10.0000")
        .refine(val => Number.isInteger(Math.round(val * 10000)), "El precio_kwh debe tener máximo 4 decimales"),
    alumbrado_publico: z
        .number()
        .min(0, "El alumbrado público debe ser mayor o igual a 0")
        .max(10000, "El alumbrado público no puede superar 10000.00")
        .refine(val => Number.isInteger(Math.round(val * 100)), "El alumbrado público debe tener máximo 2 decimales")
        .optional()
        .default(0)
}).refine(data => data.fecha_fin >= data.fecha_inicio, {
    message: "La fecha_fin debe ser igual o posterior a fecha_inicio",
    path: ["fecha_fin"]
}).refine(data => data.lectura_actual >= data.lectura_anterior, {
    message: "La lectura_actual debe ser mayor o igual a lectura_anterior",
    path: ["lectura_actual"]
});

export type NuevoConsumoDto = z.infer<typeof nuevoConsumoSchema>;
