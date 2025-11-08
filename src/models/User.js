const bcrypt = require('bcrypt');
const db = require('../config/database');

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async create(email, password, nome) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO usuarios (email, senha, nome) VALUES (?, ?, ?)',
        [email, hashedPassword, nome]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
}

module.exports = User;