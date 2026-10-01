import { Router } from "express";
import { PagoController } from "../controller/pago.controller.js";

const router = Router() as Router

const controller = new PagoController()

router.post("/registrar", controller.registrarPago)

export default router