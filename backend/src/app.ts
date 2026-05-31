import express from 'express';
import errorGlobalMiddleware from './middleWare/global/errorGlobal.middleware.js';
// importar express-async-errors para manejar errores en async/await
import 'express-async-errors'

// al usar typescript, es necesario especificar el tipo de la variable: en este caso express.Application
const app: express.Application = express();

// middleware base para parsear el body de las peticiones http
app.use(express.json());

// middleware global para manejar errores
app.use(errorGlobalMiddleware);

export default app;