import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schema/auth.DTO.js";
import { AuthService } from "../service/auth.service.js";

const authService = new AuthService();
export class AuthController {

    // registrar
    async register(req: Request, res: Response) {
        // validar el body
        const userData = registerSchema.parse(req.body);
 
        // llamar al servicio
        const user = await authService.registerUser(userData);

        // retornar la respuesta
        return res.status(201).json(user);
    }

    // login
    async login(req: Request, res: Response) {
        // validar el body
        const userData = loginSchema.parse(req.body);
 
        // llamar al servicio
        const user = await authService.loginUser(userData);

        // retornar la respuesta
        return res.status(200).json(user);
    }
}
