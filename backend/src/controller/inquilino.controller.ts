import type { Request, Response } from "express";
import { InquilinoService } from "../service/inquilino.service.js";
import { registrarInquilinoSchema } from "../schema/registrarInquilinoDTO.js";

const inquilinoService = new InquilinoService();

export class InquilinoController {

    registrarInquilino = async (req: Request, res: Response) => {
        console.log("Registrando inquilino...");
        // 1. Validar el body
        const inquilino = registrarInquilinoSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await inquilinoService.registrarInquilino(inquilino);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Inquilino registrado correctamente" })
    }
}
