import type { Request, Response } from "express";
import { ContratoService } from "../service/contrato.service.js";
import { crearContratoSchema } from "../schema/crearContratoDTO.js";
import { cerrarContratoSchema } from "../schema/cerrarContrato.DTO.js";

const contratoService = new ContratoService();

export class ContratoController {

    crearContrato = async (req: Request, res: Response) => {
        console.log("Creando contrato...");
        // 1. Validar el body
        const contrato = crearContratoSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await contratoService.crearContrato(contrato);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Contrato creado correctamente" })
    }

    cerrarContrato = async (req: Request, res: Response) => {
        console.log("Cerrando contrato...");
        // 1. Validar el body
        const contratoId = cerrarContratoSchema.parse(req.body);
        // 2. Llamar al servicio
        await contratoService.cerrarContrato(contratoId.contrato_id);
        // 3. Retornar la respuesta
        res.status(200).json({ message: "Contrato cerrado correctamente" })
    }
}