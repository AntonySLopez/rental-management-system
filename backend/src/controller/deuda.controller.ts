import type { Request, Response } from "express";
import { DeudaService } from "../service/deuda.service.js";
import { consultarDeudaDTOSchema } from "../schema/consultarDeudaDTO.js";

const deudaService = new DeudaService();

export class DeudaController {
    consultarDeuda = async (req: Request, res: Response) => {
        console.log("Consultando deuda...");
        // 1. Validar el body
        const deuda = consultarDeudaDTOSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await deudaService.consultarDeuda(deuda);
        // 3. Retornar la respuesta
        console.log("resultado: ", result);
        res.status(200).json(result);
    }
}