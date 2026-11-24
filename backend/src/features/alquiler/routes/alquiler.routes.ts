import { Router } from "express";
import { AlquilerController } from "../controller/alquiler.controller.js";

const router: Router = Router();
const alquilerController = new AlquilerController();

// GET /alquiler/:contrato_id/cuotas - Listar cuotas de alquiler
router.get("/:contrato_id/cuotas", alquilerController.listarCuotas);

// GET /alquiler/:contrato_id/cuota/:id - Obtener pago de cuota por id
router.get("/:contrato_id/cuota/:id", alquilerController.detalleCuota);

// POST /alquiler/:contrato_id/cuota/:id/pago - Registrar pago de alquiler
router.post("/:contrato_id/cuota/:id/pago", alquilerController.nuevoPagoAlquiler);

export default router;
