import { ConsumoLuzService } from "../service/consumoLuz.service.js";
import { registrarConsumoLuzSchema } from "../interface/schema/registrarConsumoLuzDTO.js";
import type { Request, Response } from "express";
import type { ConsumoLuzDetalle } from "../../../types/luz.types.js";

const consumoLuzService = new ConsumoLuzService();

export class ConsumoLuzController {

    registrarConsumoLuz = async (req: Request, res: Response) => {
        console.log("Registrando consumo de luz...");
        // 1. Validar el body
        const consumo = registrarConsumoLuzSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await consumoLuzService.registrarConsumoLuz(consumo);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Consumo de luz registrado correctamente" })
    }
    
    // obtiene detalles de consumo por id
    findConsumoById = async (req: Request, res: Response<ConsumoLuzDetalle>) => {
        console.log("Obteniendo detalles de consumo por id...");
        // 1. Validar el body
        const id = req.params.id;
        // 2. Llamar al servicio
        const result = await consumoLuzService.findConsumoById(Number(id));
        // 3. Retornar la respuesta
        console.log(result);
        res.status(200).json(result)
    }
}