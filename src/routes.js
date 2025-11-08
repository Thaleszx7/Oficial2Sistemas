const express = require('express');
const router = express.Router();
const AuthController = require('./controllers/AuthController');
const RelatorioController = require('./controllers/RelatorioController');
const { isAuthenticated, isNotAuthenticated } = require('./middleware/auth');

// Rota raiz - redireciona para dashboard se autenticado, senão para login
router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Rotas de autenticação
router.get('/login', isNotAuthenticated, AuthController.showLogin);
router.post('/login', isNotAuthenticated, AuthController.login);
router.get('/logout', AuthController.logout);

// Rotas protegidas
router.get('/dashboard', isAuthenticated, RelatorioController.showDashboard);
router.get('/buscar-vendas', isAuthenticated, RelatorioController.buscarVendas);
router.post('/gerar-relatorio', isAuthenticated, RelatorioController.gerarRelatorio);

module.exports = router;