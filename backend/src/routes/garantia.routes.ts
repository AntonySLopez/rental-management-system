import { Router } from "express";
import { GarantiaController } from "../controller/garantia.controller.js";

const router = Router() as Router

const controller = new GarantiaController()

router.post("/devolver", controller.devolverGarantia)
router.post("/aplicar", controller.aplicarGarantia)

export default router