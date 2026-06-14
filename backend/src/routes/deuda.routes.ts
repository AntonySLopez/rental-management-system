import { Router } from "express";
import { DeudaController } from "../controller/deuda.controller.js";

const router = Router() as Router

const controller = new DeudaController()

router.post("/consultar", controller.consultarDeuda)

export default router