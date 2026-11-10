import { Router } from "express";
import { ContratoController } from "../controller/contrato.controller.js";

const router: Router = Router();
const contratoController = new ContratoController();

// POST /contratos/registrar - Crear nuevo contrato
router.post("/registrar", contratoController.nuevoContrato);

// GET /contratos - Listar contratos con paginación
router.get("/", contratoController.listarContratos);

// GET /contratos/:id - Detalle de contrato
router.get("/:id", contratoController.detalleContrato);

// PATCH /contratos/:id - Actualizar contrato
router.patch("/:id", contratoController.actualizarContrato);

// PATCH /contratos/:id/cerrar - Cerrar contrato
router.patch("/:id/cerrar", contratoController.cerrarContrato);

// PATCH /contratos/:id/renovar - Renovar contrato
router.post("/:id/renovar", contratoController.renovarContrato);

export default router;
