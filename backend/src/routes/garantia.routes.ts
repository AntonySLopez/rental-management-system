import { Router } from "express";
import { GarantiaController } from "../controller/garantia.controller.js";

const router = Router() as Router

const controller = new GarantiaController()

router.post("/devolver", controller.devolverGarantia)
router.post("/aplicar", controller.aplicarGarantia)
router.get("/retenidas", controller.listarGarantiasRetenidas)
router.get("/detallada/:id", controller.obtenerGarantiaDetallada)

export default router