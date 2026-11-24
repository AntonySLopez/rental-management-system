import { Router } from "express";
import { InquilinoController } from "../controller/inquilino.controller.js";

const router: Router = Router();
const inquilinoController = new InquilinoController();

// POST /inquilinos/register - Registrar nuevo inquilino
router.post("/register", inquilinoController.registrarInquilino);

// GET /inquilinos - Listar inquilinos con paginación
router.get("/", inquilinoController.listarInquilinos);

// GET /inquilinos/:id - Obtener inquilino por id
router.get("/:id", inquilinoController.detalleInquilino);

// PATCH /inquilinos/:id - Actualizar inquilino
router.patch("/:id", inquilinoController.actualizarInquilino);

export default router;
