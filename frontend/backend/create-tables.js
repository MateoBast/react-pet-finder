import pool from './pet-finder-db.js';

const createTables = async () => {
  const queryUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL
    );
  `;

  const queryPets = `
    CREATE TABLE IF NOT EXISTS pets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(50) CHECK (status IN ('lost', 'found')) NOT NULL,
      location VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(255),
      reporterId INTEGER REFERENCES users(id)
    );
  `;

  const queryReports = `
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      petId INTEGER REFERENCES pets(id),
      reporterPhone VARCHAR(50) NOT NULL,
      location VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
