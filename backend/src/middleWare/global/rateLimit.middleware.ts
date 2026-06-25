import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = () => {
    return rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minuto
        max: 10 // límite por IP
    });
}