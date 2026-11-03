import pool from '../servicesback/pet-finder-db.js';

class ReportModel {
static async createReport(petId, reporterName, reporterPhone, location, reporterId) {
  const query = `
    INSERT INTO reports (petId, reporterName, reporterPhone, location, reporterId, timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const result = await pool.query(query, [petId, reporterName, reporterPhone, location, reporterId]);
  return result.rows[0];
}


  static async getAllReports() {
    const result = await pool.query('SELECT * FROM reports');
    return result.rows;
  }

  static async getReportById(id) {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateReport(id, petId, reporterPhone, location) {
    const query = `
      UPDATE reports
      SET petId = $1, reporterPhone = $2, location = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [petId, reporterPhone, location, id]);
    return result.rows[0];
  }

  static async deleteReport(id) {
    const query = 'DELETE FROM reports WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  static async getOwnerEmailByPetId(petId) {
    const result = await pool.query('SELECT email FROM users WHERE id = (SELECT ownerId FROM pets WHERE id = $1)', [petId]);
    return result.rows[0]?.email; // Devuelve el email o undefined si no existe
  }
static async getReporterEmailByPetId(petId) {
  const query = `
    SELECT users.email 
    FROM users 
    INNER JOIN pets ON pets."reporterId" = users.id 
    WHERE pets.id = $1;
  `;
  const result = await pool.query(query, [petId]);
  return result.rows[0]?.email;
}
}

export default ReportModel;
