import pool from './servicesback/react-pet-finder-db.js';

const createTables = async () => {
const queryUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiration BIGINT
  );
`;

const queryPets = `
  CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('lost', 'found')) NOT NULL,
    location TEXT NOT NULL,
    imageurl TEXT,
    reporterId INTEGER REFERENCES users(id),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    descripcion TEXT
  );
`;


const queryReports = `
  CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    petid INTEGER REFERENCES pets(id),
    reporterphone VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reportername VARCHAR(255),
    reporterid INTEGER
  );
`;


  try {
    await pool.query(queryUsers);
    await pool.query(queryPets);
    await pool.query(queryReports);
    console.log('Tablas creadas exitosamente.');
  } catch (error) {
    console.error('Error al crear tablas:', error);
  } finally {
    pool.end(); // Cerramos la conexión
  }
};

createTables(); // <-- Acá la ejecutás
