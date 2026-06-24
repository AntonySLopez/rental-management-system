import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../flujo/appError.middleware.js';
import { ZodError } from 'zod';

function errorGlobalMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AppError && err.isOperational){
        const { statusCode, message } = err;
        console.error(err);
        res.status(statusCode).json({
            message: message
        })
    } else if(err instanceof ZodError){
        console.error(err);
        res.status(400).json({
            message: 'Bad estructure request',
            errors: err.issues
        })
    } else if(err.name === "JsonWebTokenError"){
        console.error(err);
        res.status(401).json({
            message: 'Token inválido'
        })
    } else if(err.name === "TokenExpiredError"){
        console.error(err);
        res.status(401).json({
            message: 'Token expirado'
        })
    } else if(err.name === "NotBeforeError"){
        console.error(err);
        res.status(401).json({
            message: 'Token aún no válido'
        })
    } else {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export default errorGlobalMiddleware;