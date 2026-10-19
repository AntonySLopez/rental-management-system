import { AppError } from "../../../../shared/appError.js";
import { RDRepository } from "../../repository/rd.repository.js";

/**
 * RD - Reglas de Dominio consolidadas
 * Clase que contiene todas las reglas según B8
 */
export class RD {
    constructor(private rdRepository: RDRepository) {}

    /**
     * RD.registrarnuevoLocal
     * Reglas de dominio para registrar local
     */
    registrarnuevoLocal = {
        /**
         * nombreLocalUnico.repository()
         * Valida que el nombre no exista en otro local
         */
        nombreLocalUnico: async (nombre: string): Promise<boolean> => {
            const localExistente = await this.rdRepository.nombreLocalUnico(nombre);
            
            if (localExistente) {
                throw new AppError("El nombre del local ya está registrado", 409);
            }
            
            return true;
        }
    };

    /**
     * RD.actualizarLocal
     * Reglas de dominio para actualizar local
     */
    actualizarLocal = {
        /**
         * localExiste.repository()
         * Valida que el local exista
         */
        localExiste: async (id: number): Promise<boolean> => {
            const existe = await this.rdRepository.localExiste(id);
            
            if (!existe) {
                throw new AppError("El local no existe", 404);
            }
            
            return true;
        },

        /**
         * nombreLocalUnico.repository()
         * Valida que el nombre no exista en otro local
         */
        nombreLocalUnico: async (id: number, nombre: string): Promise<boolean> => {
            const localExistente = await this.rdRepository.nombreLocalUnico(nombre, id);
            
            if (localExistente) {
                throw new AppError("El nombre del local ya está registrado en otro local", 409);
            }
            
            return true;
        }
    };

    /**
     * RD.detalleLocal
     * Reglas de dominio para obtener detalle de local
     */
    detalleLocal = {
        /**
         * localExiste.repository()
         * Valida que el local exista
         */
        localExiste: async (id: number): Promise<boolean> => {
            const existe = await this.rdRepository.localExiste(id);
            
            if (!existe) {
                throw new AppError("El local no existe", 404);
            }
            
            return true;
        }
    };
}
