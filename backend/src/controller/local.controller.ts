import type { Request, Response } from "express";
import { registrarLocalSchema } from "../schema/registrarLocalDTO.js";
import { LocalService } from "../service/local.service.js";

const localService = new LocalService();

export class LocalController {

    // registra local
    registrarLocal = async (req: Request, res: Response) => {
        console.log("Registrando local...");
        // 1. Validar el body
        const local = registrarLocalSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await localService.registrarLocal(local);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Local registrado correctamente" })
    }
    
    // obtiene lista de locales
    listaLocales = async (req: Request, res: Response) => {
        console.log("Obteniendo lista de locales...");
        // 1. Extraer propiedadId del request
        const propiedadId = Number(req.params.propiedadId);
        // 2. Llamar al servicio
        const result = await localService.listaLocales(propiedadId);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(200).json(result)
    }
}