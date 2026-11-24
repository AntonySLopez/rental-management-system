import { Router } from "express";
import { LocalController } from "../controller/local.controller.js";

const router: Router = Router();
const localController = new LocalController();

// POST /locales/register - Registrar nuevo local
router.post("/register", localController.registrarLocal);

// GET /locales - Listar locales con paginación
router.get("/", localController.listarLocales);

// GET /locales/:id - Obtener detalle de local
router.get("/:id", localController.detalleLocal);

// PATCH /locales/:id - Actualizar local
router.patch("/:id", localController.actualizarLocal);

export default router;
