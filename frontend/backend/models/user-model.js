import pool from '../servicesback/pet-finder-db.js';

class UserModel {

static async savePasswordResetToken(userId, token, expiration) {
  const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expiration = $2
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [token, expiration, userId]);
  return result.rows[0];
}
  static async createUser(name, email, password, location) {
    const query = `
      INSERT INTO users (name, email, password, location)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, email, password, location || null]);
    return result.rows[0];
  }
  static async findByResetToken(token) {
  const query = 'SELECT * FROM users WHERE reset_token = $1';
  const result = await pool.query(query, [token]);
  return result.rows[0];
}

static async clearResetToken(userId) {
  const query = `
    UPDATE users
    SET reset_token = NULL, reset_token_expiration = NULL
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}


  static async getAllUsers() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }

  static async getUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async updateUser(id, fieldsToUpdate) {
    const setString = Object.keys(fieldsToUpdate)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(fieldsToUpdate);

    const query = `
      UPDATE users
      SET ${setString}
      WHERE id = $${values.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  // Método para actualizar la contraseña
static async updatePassword(userId, hashedPassword) {
  console.log('Actualizando contraseña para el usuario:', userId);
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING *;
  `;
  
  const result = await pool.query(query, [hashedPassword, userId]);
  
  console.log('Resultado de la actualización de contraseña:', result.rows[0]);
  return result.rows[0];
}

  static async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default UserModel;
