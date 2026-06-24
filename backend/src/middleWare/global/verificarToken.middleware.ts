import type { Request, Response, NextFunction } from 'express';
import env from '../../config/env.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../flujo/appError.middleware.js';

export default function verificarToken(req: Request, res: Response, next: NextFunction) {
    // validar token existente
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new AppError('Token no proporcionado', 401);
    }
    // compara token con el que se generó
    jwt.verify(token, env.JWT_SECRET);
    next();

}