import { Router } from "express";
import { ContratoController } from "../controller/contrato.controller.js";

const router = Router() as Router

const controller = new ContratoController()

router.post("/crear", controller.crearContrato)
router.post("/cerrar", controller.cerrarContrato)

export default router