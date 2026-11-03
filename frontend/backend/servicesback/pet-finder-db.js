import pg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const { Pool } = pg;

// Crear un pool de conexiones usando la URL de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usar la variable de entorno
  ssl: {
    rejectUnauthorized: false, // Esto es necesario para conexiones en producción
  },
});

export default pool;
