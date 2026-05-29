import express from 'express';
// al usar typescript, es necesario especificar el tipo de la variable: en este caso express.Application
const app: express.Application = express();

// middleware base para parsear el body de las peticiones http
app.use(express.json());

export default app;