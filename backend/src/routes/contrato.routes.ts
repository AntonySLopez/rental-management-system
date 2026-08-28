import { Router } from "express";
import { ContratoController } from "../controller/contrato.controller.js";

const router = Router() as Router

const controller = new ContratoController()

router.post("/crear", controller.crearContrato);
router.post("/cerrar", controller.cerrarContrato);
router.post("/renovar", controller.renovarContrato);
router.get("/buscar/:id", controller.buscarContratoPorId);
router.get("/activos", controller.listaContratosActivos);

export default router