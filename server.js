require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const rabbitmq = require('./config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configurar sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'seu_secret_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? false : false, // Mude para true se usar HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Rotas
app.use('/', routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handler de erro 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// Handler de erro geral
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).send('Algo deu errado!');
});

// Inicializar RabbitMQ
rabbitmq.connect().catch(err => {
  console.error('Erro ao conectar ao RabbitMQ:', err);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Servidor iniciado!');
  console.log(`📡 Rodando em: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM recebido. Fechando servidor...');
  await rabbitmq.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n👋 SIGINT recebido. Fechando servidor...');
  await rabbitmq.close();
  process.exit(0);
});