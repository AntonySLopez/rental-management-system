import type { Request, Response } from "express";
import { PropiedadService } from "../service/propiedad.service.js";
import { registrarPropiedadSchema } from "../schema/registrarPropiedadDTO.js";

const propiedadService = new PropiedadService();

export class PropiedadController {

    registrarPropiedad = async (req: Request, res: Response) => {
        console.log("Registrando propiedad...");
        // 1. Validar el body
        const propiedad = registrarPropiedadSchema.parse(req.body);
        // 2. Llamar al servicio
        const result = await propiedadService.registrarPropiedad(propiedad);
        // 3. Retornar la respuesta
        console.log(result);
        res.status(201).json({ message: "Propiedad registrada correctamente" })
    }

    obtenerListaPropiedades = async (req: Request, res: Response) => {
        console.log("Obteniendo lista de propiedades...");
        // 1. Llamar al servicio
        const result = await propiedadService.obtenerListaPropiedades();
        // 2. Retornar la respuesta
        console.log(result);
        res.status(200).json(result)
    }
}
