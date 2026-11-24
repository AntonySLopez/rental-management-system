import { Router } from "express";
import { ConsumoController } from "../controller/consumo.controller.js";

const router: Router = Router();
const consumoController = new ConsumoController();

// POST /consumo/:contrato_id/registrar - Registrar consumo de luz (Caso #21)
router.post("/:contrato_id/registrar", consumoController.nuevoConsumo);

// GET /consumo/:contrato_id/ - Listar consumos de luz por contrato (Caso #22)
router.get("/:contrato_id/", consumoController.listarConsumos);

// GET /consumo/:contrato_id/detalle/:id - Obtener consumo por id (Caso #23)
router.get("/:contrato_id/detalle/:id", consumoController.detalleConsumo);

// POST /consumo/:contrato_id/pagar/:id - Registrar pago de consumo (Caso #24)
router.post("/:contrato_id/pagar/:id", consumoController.nuevoPagoConsumo);

export default router;
