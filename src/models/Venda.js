const db = require('../config/database');

class Venda {
  static async findWithFilters(unidade, ano, limit = 8) {
    try {
      let query = 'SELECT * FROM vendas WHERE 1=1';
      const params = [];

      if (unidade && unidade !== '') {
        query += ' AND unidade = ?';
        params.push(unidade);
      }

      if (ano && ano !== '') {
        query += ' AND YEAR(data_venda) = ?';
        params.push(ano);
      }

      query += ' ORDER BY data_venda DESC LIMIT ?';
      params.push(parseInt(limit));

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      throw error;
    }
  }

  static async findAllWithFilters(unidade, ano) {
    try {
      let query = 'SELECT * FROM vendas WHERE 1=1';
      const params = [];

      if (unidade && unidade !== '') {
        query += ' AND unidade = ?';
        params.push(unidade);
      }

      if (ano && ano !== '') {
        query += ' AND YEAR(data_venda) = ?';
        params.push(ano);
      }

      query += ' ORDER BY data_venda DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todas as vendas:', error);
      throw error;
    }
  }

  static async getUnidades() {
    try {
      const [rows] = await db.query(
        'SELECT DISTINCT unidade FROM vendas ORDER BY unidade'
      );
      return rows.map(row => row.unidade);
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      throw error;
    }
  }

  static async getAnos() {
    try {
      const [rows] = await db.query(
        'SELECT DISTINCT YEAR(data_venda) as ano FROM vendas ORDER BY ano DESC'
      );
      return rows.map(row => row.ano);
    } catch (error) {
      console.error('Erro ao buscar anos:', error);
      throw error;
    }
  }
}

module.exports = Venda;