import { Router } from "express";

import inquilinoRoutes from "../features/RfInquilino/routes/inquilino.routes.js";
import authRoutes from "../features/auth/routes/auth.routes.js";
import propiedadRoutes from "../features/propiedad/routes/propiedad.routes.js";
import localRoutes from "../features/RfLocal/routes/local.routes.js";
import contratoRoutes from "../features/Rfcontrato/routes/contrato.routes.js";
import deudaRoutes from "../features/deuda/routes/deuda.routes.js";
import pagoRoutes from "../features/pago/routes/pago.routes.js";
import garantiaRoutes from "../features/RfGarantia/routes/garantia.routes.js";
import alquiler from "../features/RfAlquiler/routes/alquiler.routes.js";
import consumoRoutes from "../features/RfConsumo/routes/consumo.routes.js";

const routes = Router() as Router;
// inquilino refactorizado
routes.use("/inquilino", inquilinoRoutes);
routes.use("/auth", authRoutes);
routes.use("/propiedad", propiedadRoutes);
// local refactorizado
routes.use("/local", localRoutes);
// contrato refactorizado
routes.use("/contrato", contratoRoutes);
// consumo refactorizado
routes.use("/consumo", consumoRoutes);
routes.use("/deuda", deudaRoutes);
routes.use("/pago", pagoRoutes);
// garantia refactorizado
routes.use("/garantia", garantiaRoutes);
// alquiler refactorizado
routes.use("/alquiler", alquiler);

export default routes;