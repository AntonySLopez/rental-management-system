import { Router } from "express";
import { ConsumoLuzController } from "../controller/consumoLuz.controller.js";

const router = Router() as Router;

const consumoLuzController = new ConsumoLuzController();

router.post("/registrar/consumo", consumoLuzController.registrarConsumoLuz);
router.get("/detalle/:id", consumoLuzController.findConsumoById);

export default router;