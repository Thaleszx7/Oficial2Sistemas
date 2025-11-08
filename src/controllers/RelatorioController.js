const Venda = require('../models/Venda');
const rabbitmq = require('../config/rabbitmq');

class RelatorioController {
  static async showDashboard(req, res) {
    try {
      const unidades = await Venda.getUnidades();
      const anos = await Venda.getAnos();

      res.render('dashboard', {
        user: {
          nome: req.session.userName,
          email: req.session.userEmail
        },
        unidades,
        anos,
        vendas: [],
        filtros: {}
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      res.status(500).send('Erro ao carregar dashboard');
    }
  }

  static async buscarVendas(req, res) {
    try {
      const { unidade, ano } = req.query;
      
      const vendas = await Venda.findWithFilters(unidade, ano, 8);
      const unidades = await Venda.getUnidades();
      const anos = await Venda.getAnos();

      res.render('dashboard', {
        user: {
          nome: req.session.userName,
          email: req.session.userEmail
        },
        unidades,
        anos,
        vendas,
        filtros: { unidade, ano }
      });
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      res.status(500).send('Erro ao buscar vendas');
    }
  }

  static async gerarRelatorio(req, res) {
    try {
      const { unidade, ano } = req.body;

      // Enviar mensagem para a fila
      const message = {
        unidade: unidade || '',
        ano: ano || '',
        userEmail: req.session.userEmail,
        userName: req.session.userName,
        timestamp: new Date().toISOString()
      };

      const success = await rabbitmq.sendToQueue(message);

      if (success) {
        res.render('processing', {
          user: {
            nome: req.session.userName,
            email: req.session.userEmail
          },
          filtros: { unidade, ano }
        });
      } else {
        res.status(500).send('Erro ao enviar solicitação para a fila');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).send('Erro ao gerar relatório');
    }
  }
}

module.exports = RelatorioController;