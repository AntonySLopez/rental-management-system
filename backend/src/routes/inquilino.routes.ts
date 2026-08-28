import { Router } from "express";
import { InquilinoController } from "../controller/inquilino.controller.js";

const router = Router() as Router

const controller = new InquilinoController()

router.post("/registrar", controller.registrarInquilino);
router.get("/lista", controller.listaInquilinos);

export default router