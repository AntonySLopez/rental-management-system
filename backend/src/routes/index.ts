import { Router } from "express";

import inquilinoRoutes from "../features/inquilinos/routes/inquilino.routes.js";
import authRoutes from "../features/auth/routes/auth.routes.js";
import propiedadRoutes from "../features/propiedad/routes/propiedad.routes.js";
import localRoutes from "../features/local/routes/local.routes.js";
import contratoRoutes from "../features/contrato/routes/contrato.routes.js";
import luzRoutes from "../features/consumoLuz/routes/luz.routes.js";
import deudaRoutes from "../features/deuda/routes/deuda.routes.js";
import pagoRoutes from "../features/pago/routes/pago.routes.js";
import garantiaRoutes from "../features/garantia/routes/garantia.routes.js";

const routes = Router() as Router;

routes.use("/inquilino", inquilinoRoutes);
routes.use("/auth", authRoutes);
routes.use("/propiedad", propiedadRoutes);
routes.use("/local", localRoutes);
routes.use("/contrato", contratoRoutes);
routes.use("/luz", luzRoutes);
routes.use("/deuda", deudaRoutes);
routes.use("/pago", pagoRoutes);
routes.use("/garantia", garantiaRoutes);

export default routes;