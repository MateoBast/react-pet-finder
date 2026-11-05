import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.URL_DATABASE, // Asegúrate de que esta variable esté en tu .env
});

pool.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    pool.end(); // Cerrar la conexión
  })
  .catch(err => {
    console.error('Error de conexión', err);
  });


  export default pool;
