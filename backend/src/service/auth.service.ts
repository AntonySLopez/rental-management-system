import { AuthRepository } from "../repository/auth.respository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import type { RegisterInput, LoginInput } from "../schema/auth.DTO.js";
import type { RegisterUser, LoginUser } from "../types/auth.types.js";
import type { PoolClient } from "pg";
import { AppError } from "../middleWare/flujo/appError.middleware.js";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }
    // registra usuario nuevo
    async registerUser(user: RegisterInput, client?: PoolClient) {

        // hashear contraseña
        user.password = await bcrypt.hash(user.password, 10);
        // guardar usuario
        return this.registrarUsuario(user, client);
    }
    
    // login de usuario
    async loginUser(user: LoginInput, client?: PoolClient) {
        // obtiene usuario por email
        const { email, password } = user;
        // buscar usuario por email en base de datos
        const userFound = await this.buscarUsuarioPorEmail(email, client);

        // verificar contraseña
        await this.compararContrasena(password, userFound.password);
       
        // generar token JWT
        const token = await this.generarToken(userFound);

        // retornar datos de usuario y token
        return {nombre: userFound.nombre, token};
    }

    // ----------------------** REGISTRO **------------------
    private async registrarUsuario (user: RegisterUser, client?: PoolClient) {
        // persistir usuario en base de datos
        return this.authRepository.saveAdmin(user, client);
    }

    // ----------------------** LOGIN **------------------
    private async buscarUsuarioPorEmail (email: string, client?: PoolClient) {
        // buscar usuario por email en base de datos
        const userFound = await this.authRepository.findByEmail(email, client);
        // lanzar error si usuario no existe
        if (!userFound) {
            throw new AppError("Usuario no encontrado", 404);
        }
        return userFound;
    }

    private async compararContrasena (password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        // lanzar error si contraseña es incorrecta
        if (!isPasswordValid) {
            throw new AppError("Contraseña incorrecta", 401);
        }
    }

    private async generarToken (user: LoginUser) {
        // configurar tiempo de expiración del token (24 horas)
        const expiresIn = 60 * 60 * 24;
        // generar token JWT con email del usuario
        const token = jwt.sign({ email: user.email }, env.JWT_SECRET, { expiresIn });
        return token;
    }
}
