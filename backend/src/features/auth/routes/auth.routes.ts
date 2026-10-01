import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

const router: Router = Router();
const authController = new AuthController();

// seguridad: se quitó el endpoint de registro

router.post("/login", authController.login);

export default router;