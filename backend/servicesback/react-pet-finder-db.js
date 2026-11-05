import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.URL_DATABASE, // Asegúrate de que esta variable esté en tu .env
});

// Exportar el pool para usarlo en otros módulos
export default pool;
