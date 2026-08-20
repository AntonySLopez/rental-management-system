import { Router } from "express";
import { PropiedadController } from "../controller/propiedad.controller.js";

const router = Router() as Router;

const controller = new PropiedadController();

router.post("/registrar", controller.registrarPropiedad);

router.get("/lista", controller.obtenerListaPropiedades);

export default router;