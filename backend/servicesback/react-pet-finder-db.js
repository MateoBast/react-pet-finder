import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.URL_DATABASE)
const pool = new Pool({
  connectionString: process.env.URL_DATABASE, // Asegúrate de que esta variable esté en tu .env
});

pool.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    // No cerrar el pool acá
  })
  .catch(err => {
    console.error('Error de conexión', err);
  });


  export default pool;
