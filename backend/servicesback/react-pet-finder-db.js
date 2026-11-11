import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.URL_DATABASE);

const pool = new Pool({
  connectionString: process.env.URL_DATABASE, // fijate que coincida el nombre de la variable
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('Error de conexión', err);
  });

export default pool;
