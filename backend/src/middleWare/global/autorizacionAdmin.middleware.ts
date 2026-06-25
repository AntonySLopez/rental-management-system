import type { Request, Response, NextFunction } from "express";
import { AuthRepository } from "../../repository/auth.respository.js";
import { AppError } from "../flujo/appError.middleware.js";

const authRepository = new AuthRepository();

export async function autorizacionAdmin(req: Request, res: Response, next: NextFunction) {
  // extrae email de 
  const email = req.user!.email;
  // busca usuario por email
  const user = await authRepository.findByEmail(email);
  // verifica si el usuario es administrador
  if (user.acceso_id !== 1) {
    throw new AppError("No autorizado", 403);
  }
  next();
};