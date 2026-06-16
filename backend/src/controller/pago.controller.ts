import { PagoService } from "../service/pago.service.js";
import { registrarPagoSchema } from "../schema/RegistrarPagoDTO.js";
import type { Request, Response } from "express";

const pagoService = new PagoService();

export class PagoController {
    
    registrarPago = async (req: Request, res: Response) => {
        console.log("Registrando pago...");
        // 1. Validar el body
        const pago = registrarPagoSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await pagoService.registrarPago(pago);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Pago registrado correctamente" })
    }
}