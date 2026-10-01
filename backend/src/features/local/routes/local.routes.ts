import { Router } from "express";
import { LocalController } from "../controller/local.controller.js";

const router = Router() as Router;

const localController = new LocalController();

router.post("/registrar", localController.registrarLocal);
router.get("/lista/:propiedadId", localController.listaLocales);
router.get("/todos", localController.findAllLocales);

export default router;