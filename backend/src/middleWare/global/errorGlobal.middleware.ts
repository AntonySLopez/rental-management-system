import express from 'express';
import { AppError } from '../flujo/appError.middleware.js';

function errorGlobalMiddleware(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    if(err instanceof AppError && err.isOperational){
        const { statusCode, message } = err;
        console.error(err);
        res.status(statusCode).json({
            message: message
        })
    } else {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export default errorGlobalMiddleware;