import { Router } from "express";

import authRoutes from "../features/auth/routes/auth.routes.js";
import inquilinoRoutes from "../features/inquilino/routes/inquilino.routes.js";
import localRoutes from "../features/local/routes/local.routes.js";
import contratoRoutes from "../features/contrato/routes/contrato.routes.js";
import garantiaRoutes from "../features/garantia/routes/garantia.routes.js";
import alquiler from "../features/alquiler/routes/alquiler.routes.js";
import consumoRoutes from "../features/consumo/routes/consumo.routes.js";

const routes = Router() as Router;

routes.use("/auth", authRoutes);
routes.use("/inquilino", inquilinoRoutes);
routes.use("/local", localRoutes);
routes.use("/contrato", contratoRoutes);
routes.use("/garantia", garantiaRoutes);
routes.use("/alquiler", alquiler);
routes.use("/consumo", consumoRoutes);

export default routes;