import { Router } from "express";
import inquilinoRoutes from "./inquilino.routes.js";

const routes = Router() as Router;

routes.use("/inquilino", inquilinoRoutes);

export default routes;