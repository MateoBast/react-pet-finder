import pool from '../servicesback/pet-finder-db.js';

class PetModel {
  static async createPet(name, status, location, imageUrl, reporterId = null, descripcion) {
    const query = `
      INSERT INTO pets (name, status, location, imageUrl, "reporterId", descripcion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, status, location, imageUrl, reporterId, descripcion]);
    return result.rows[0];
  }
  
static async getAllPets() {
  const result = await pool.query("SELECT * FROM pets WHERE status != 'found'");
  return result.rows;
}
  
  static async getPetById(id) {
    const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    return result.rows[0];
  }
  
  // Actualización flexible con objeto updateData
  static async updatePet(id, updateData) {
    // Armamos dinámicamente la query y los valores para solo actualizar lo que venga
    const fields = [];
    const values = [];
    let idx = 1;
    
    for (const key in updateData) {
      fields.push(`"${key}" = $${idx}`);
      values.push(updateData[key]);
      idx++;
    }
    values.push(id);
    
    const query = `
    UPDATE pets
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async getPetsByReporterId(reporterId) {
    const query = 'SELECT * FROM pets WHERE "reporterId" = $1;';
    const result = await pool.query(query, [reporterId]);
  
    return result.rows;
  }
  
  static async deletePet(id) {
    const query = 'DELETE FROM pets WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default PetModel;
