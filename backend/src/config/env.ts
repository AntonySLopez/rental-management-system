import z from "zod";
//creamos el esquema de validacion de variables de entorno
const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform((val) => Number(val)),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});
// se usa safeParse para evitar que el proceso se detenga
const parsed = envSchema.safeParse(process.env);
// Si no se parsea correctamente, salir
if(!parsed.success){
    process.exit(1);
};

const env = parsed.data;

export default env;