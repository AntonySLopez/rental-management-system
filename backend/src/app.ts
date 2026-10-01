import express from 'express';
import errorGlobalMiddleware from './middleWare/errorGlobal.middleware.js';
import verificarToken from './middleWare/verificarToken.middleware.js';
import authRoutes from "./features/auth/routes/auth.routes.js";  // ✅ Correcto
import helmet from 'helmet';
import cors from 'cors';
import { rateLimitMiddleware } from './middleWare/rateLimit.middleware.js';
import routes from './routes/index.js';
import { autorizacionAdmin } from './middleWare/autorizacionAdmin.middleware.js';

// al usar typescript, es necesario especificar el tipo de la variable: en este caso express.Application
const app: express.Application = express();

// helmet para headers de seguridad
app.use(helmet());

// cors para controlar el acceso desde diferentes orígenes
app.use(cors());

// middleware base para parsear el body de las peticiones http
app.use(express.json());

// rate limiting para prevenir abuso de la API
app.use(rateLimitMiddleware);

// rutas de autenticación
app.use("/auth", authRoutes);

// middleware para verificar token
app.use(verificarToken);

// middleware para acceso a rutas de rol de administrador
app.use(autorizacionAdmin, routes);

// middleware global para manejar errores
app.use(errorGlobalMiddleware);

export default app;