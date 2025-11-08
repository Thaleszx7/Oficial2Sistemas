require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'relatorios_queue';

let channel = null;
let connection = null;

async function connect() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('✅ Conectado ao RabbitMQ com sucesso!');
    return channel;
  } catch (error) {
    console.error('❌ Erro ao conectar ao RabbitMQ:', error.message);
    // Tentar reconectar após 5 segundos
    setTimeout(connect, 5000);
  }
}

async function sendToQueue(message) {
  try {
    if (!channel) {
      await connect();
    }
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(QUEUE_NAME, messageBuffer, { persistent: true });
    console.log('📤 Mensagem enviada para a fila:', message);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem para a fila:', error.message);
    return false;
  }
}

async function getChannel() {
  if (!channel) {
    await connect();
  }
  return channel;
}

async function close() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('🔌 Conexão com RabbitMQ fechada');
  } catch (error) {
    console.error('Erro ao fechar conexão:', error.message);
  }
}

module.exports = {
  connect,
  sendToQueue,
  getChannel,
  close,
  QUEUE_NAME
};