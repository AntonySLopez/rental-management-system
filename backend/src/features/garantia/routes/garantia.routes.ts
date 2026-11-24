import { Router } from "express";
import { GarantiaController } from "../controller/garantia.controller.js";

const router: Router = Router();
const garantiaController = new GarantiaController();

// GET /garantias/:contrato_id - Obtener garantía por contrato
router.get("/:contrato_id", garantiaController.detalleGarantia);

// GET /garantias/:contrato_id/movimientos - Listar movimientos de garantía
router.get("/:contrato_id/movimientos", garantiaController.listarMovimientosGarantia);

// POST /garantias/:contrato_id/movimientos/registrar - Registrar movimiento de garantía
router.post("/:contrato_id/movimientos/registrar", garantiaController.nuevoMovimientoGarantia);

export default router;
