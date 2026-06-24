import pool from "../config/postgres.js";
import type { PoolClient } from "pg";
import type { RegisterUser } from "../types/auth.types.js";

export class AuthRepository {
    
    // guarda usuario administrador
    async saveAdmin(user: RegisterUser, client?: PoolClient) {
        const result = await (client ?? pool).query(
            `INSERT INTO users (nombre, email, password, acceso_id) VALUES ($1, $2, $3, (SELECT id FROM acceso WHERE nombre = 'administrador')) RETURNING *`,
            [user.nombre, user.email, user.password]
        );
        return result.rows[0];
    };

    // busca usuario por email
    async findByEmail(email: string, client?: PoolClient) {
        const result = await (client ?? pool).query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    };
};