const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    console.log('EMAIL SENDER: ', process.env.EMAIL_SENDER)
    console.log("EMAIL PASS: ", process.env.EMAIL_SENDER_PASSWORD);

    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_SENDER, // Seu e-mail
        pass: process.env.EMAIL_SENDER_PASSWORD, // Senha ou App Password (para Gmail)
      },
    });
  }
  async sendEmail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: `"Suporte Sulfire Sistemas" <${process.env.EMAIL_SENDER}>`,
        to,
        subject,
        text, // Corpo do e-mail em texto puro
        html, // Corpo do e-mail em HTML (opcional)
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`E-mail enviado: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha ao enviar e-mail");
    }
  }
  async sendResetPasswordEmail(to, resetToken, userId) {
    const subject = "Redefinição de Senha";
    const resetUrl = `http://localhost:8080/perfil?token=${resetToken}&id=${userId}`; 
    const text = `Você solicitou a redefinição de senha. Clique no link para continuar: ${resetUrl}\nSe não foi você, ignore este e-mail.`;
    const html = `
      <h3>Redefinição de Senha</h3>
      <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para continuar:</p>
      <a href="${resetUrl}">Redefinir Senha</a>
      <p>Se você não solicitou isso, ignore este e-mail.</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }
}

module.exports = new EmailService();
