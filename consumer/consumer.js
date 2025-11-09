require('dotenv').config();
const amqp = require('amqplib');
const excelService = require('../src/services/excelService');
const emailService = require('../src/services/emailService');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'relatorios_queue';
const EMAIL_DESTINO = process.env.EMAIL_DESTINO || 'miguel@empresa.com.br';

async function startConsumer() {
  try {
    console.log('🔄 Tentando conectar ao RabbitMQ...');
    
    // Aguardar um pouco para garantir que o RabbitMQ está pronto
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Processar apenas uma mensagem por vez
    channel.prefetch(1);
    
    console.log('✅ Consumer conectado ao RabbitMQ');
    console.log(`📬 Aguardando mensagens na fila: ${QUEUE_NAME}`);
    
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const messageContent = JSON.parse(msg.content.toString());
          console.log('📨 Nova mensagem recebida:', messageContent);
          
          // Processar o relatório
          await processarRelatorio(messageContent);
          
          // Confirmar processamento
          channel.ack(msg);
          console.log('✅ Mensagem processada com sucesso');
        } catch (error) {
          console.error('❌ Erro ao processar mensagem:', error);
          // Rejeitar mensagem e não recolocar na fila
          channel.nack(msg, false, false);
        }
      }
    });
    
    // Lidar com fechamento da conexão
    connection.on('close', () => {
      console.error('❌ Conexão com RabbitMQ fechada. Tentando reconectar...');
      setTimeout(startConsumer, 5000);
    });
    
    connection.on('error', (error) => {
      console.error('❌ Erro na conexão com RabbitMQ:', error.message);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar consumer:', error.message);
    console.log('🔄 Tentando reconectar em 5 segundos...');
    setTimeout(startConsumer, 5000);
  }
}

async function processarRelatorio(message) {
  try {
    console.log('📊 Gerando relatório Excel...');
    
    const filtros = {
      unidade: message.unidade,
      ano: message.ano
    };
    
    // Gerar relatório Excel
    const relatorio = await excelService.gerarRelatorioVendas(filtros);
    
    console.log('📧 Enviando email...');
    
    // Enviar por email
    await emailService.sendRelatorio(
      EMAIL_DESTINO,
      message.userName || 'Miguel',
      filtros,
      {
        filename: relatorio.filename,
        content: relatorio.buffer
      }
    );
    
    console.log('✅ Relatório gerado e enviado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao processar relatório:', error);
    throw error;
  }
}

// Iniciar consumer
console.log('🚀 Iniciando Consumer de Relatórios...');
startConsumer();

// Lidar com sinais de término
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando consumer...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Encerrando consumer...');
  process.exit(0);
});
