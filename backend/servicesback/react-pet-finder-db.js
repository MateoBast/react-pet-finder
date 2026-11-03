import pg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const { Pool } = pg;

// Crear un pool de conexiones usando la URL de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Agregar esto si es necesario
  }
});
export default pool;
