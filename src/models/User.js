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

  static async verifyPassword(plainPassword, storedPassword) {
    // Comparação direta - sem criptografia
    return plainPassword === storedPassword;
  }

  static async create(email, password, nome) {
    try {
      const [result] = await db.query(
        'INSERT INTO usuarios (email, senha, nome) VALUES (?, ?, ?)',
        [email, password, nome]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
}

module.exports = User;