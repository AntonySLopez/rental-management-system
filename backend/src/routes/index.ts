import { Router } from "express";
import inquilinoRoutes from "./inquilino.routes.js";
import propiedadRoutes from "./propiedad.routes.js";
import localRoutes from "./local.routes.js";
import contratoRoutes from "./contrato.routes.js";
import luzRoutes from "./luz.routes.js";
import deudaRoutes from "./deuda.routes.js";

const routes = Router() as Router;

routes.use("/inquilino", inquilinoRoutes);
routes.use("/propiedad", propiedadRoutes);
routes.use("/local", localRoutes);
routes.use("/contrato", contratoRoutes);
routes.use("/luz", luzRoutes);
routes.use("/deuda", deudaRoutes);

export default routes;