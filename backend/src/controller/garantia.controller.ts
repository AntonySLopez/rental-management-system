import type { Request, Response } from "express";
import { gestionarGarantiaSchema } from "../schema/gestionarGarantiaDTO.js";
import { GarantiaService } from "../service/garantia.service.js";

const garantiaService = new GarantiaService();

export class GarantiaController {
    
    devolverGarantia = async (req: Request, res: Response) => {
        console.log("Devolver garantia...");
        // 1. Validar el body
        const garantia = gestionarGarantiaSchema.parse(req.body);
        // 2. Llamar al servicio
        await garantiaService.devolverGarantia(garantia);
        // 3. Retornar la respuesta
        res.status(200).json({ message: "Garantia devuelta correctamente" })
    }

    aplicarGarantia = async (req: Request, res: Response) => {
        console.log("Aplicar garantia...");
        // 1. Validar el body
        const garantia = gestionarGarantiaSchema.parse(req.body);
        // 2. Llamar al servicio
        await garantiaService.aplicarGarantia(garantia);
        // 3. Retornar la respuesta
        res.status(200).json({ message: "Garantia aplicada correctamente" })
    }
}