require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.MAILTRAP_PORT || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  async sendRelatorio(destinatario, nomeDestinatario, filtros, attachment) {
    try {
      const filtroTexto = this.gerarTextoFiltros(filtros);

      const mailOptions = {
        from: '"Sistema de Relatórios" <noreply@relatorios.com.br>',
        to: destinatario,
        subject: `Relatório de Vendas - ${new Date().toLocaleDateString('pt-BR')}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Relatório de Vendas Gerado</h2>
            <p>Olá, <strong>${nomeDestinatario}</strong>!</p>
            <p>O relatório solicitado foi gerado com sucesso e está anexado neste e-mail.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Filtros Aplicados:</h3>
              ${filtroTexto}
            </div>
            
            <p>O arquivo está em formato Excel (.xlsx) e contém todos os registros que correspondem aos filtros aplicados.</p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #6c757d; font-size: 12px;">
              Esta é uma mensagem automática. Por favor, não responda este e-mail.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: attachment.filename,
            content: attachment.content,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ]
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado com sucesso:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }
  }

  gerarTextoFiltros(filtros) {
    const items = [];
    
    if (filtros.unidade && filtros.unidade !== '') {
      items.push(`<p><strong>Unidade:</strong> ${filtros.unidade}</p>`);
    } else {
      items.push(`<p><strong>Unidade:</strong> Todas</p>`);
    }
    
    if (filtros.ano && filtros.ano !== '') {
      items.push(`<p><strong>Ano:</strong> ${filtros.ano}</p>`);
    } else {
      items.push(`<p><strong>Ano:</strong> Todos</p>`);
    }
    
    return items.join('');
  }
}

module.exports = new EmailService();