import { Router } from "express";
import inquilinoRoutes from "./inquilino.routes.js";
import propiedadRoutes from "./propiedad.routes.js";

const routes = Router() as Router;

routes.use("/inquilino", inquilinoRoutes);
routes.use("/propiedad", propiedadRoutes);

export default routes;