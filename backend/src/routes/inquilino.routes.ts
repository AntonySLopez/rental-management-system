import { Router } from "express";
import { InquilinoController } from "../controller/inquilino.controller.js";

const router = Router() as Router

const controller = new InquilinoController()

router.post("/registrar", controller.registrarInquilino)

export default router