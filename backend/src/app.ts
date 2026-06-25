import express from 'express';
import errorGlobalMiddleware from './middleWare/global/errorGlobal.middleware.js';
import verificarToken from './middleWare/global/verificarToken.middleware.js';
import authRoutes from "./routes/auth.routes.js";
import helmet from 'helmet';
import cors from 'cors';
import { rateLimitMiddleware } from './middleWare/global/rateLimit.middleware.js';
import routes from './routes/index.js';

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

// middlewares para manejar las rutas
app.use(verificarToken,routes);

// middleware global para manejar errores
app.use(errorGlobalMiddleware);

export default app;