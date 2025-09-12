const emailService = require("../services/emailService");

class ContactController {
  async sendMessage(req, res) {
    const { numero, email, mensagem } = req.body;
    try {
      const to = process.env.EMAIL_RECEIVER;
      const subject = "Nova mensagem de contato do site SulFire";
      const text = `Mensagem de contato recebida pelo site:\n\nTelefone: ${numero}\nE-mail: ${email}\nMensagem: ${mensagem}`;
      const html = `
            <h3>Nova mensagem de contato recebida pelo site</h3>
            <p><strong>Telefone:</strong> ${numero}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Mensagem:</strong><br/>${mensagem}</p>
          `;
      await emailService.sendEmail(to, subject, text, html);
      return res
        .status(200)
        .json({ message: "Mensagem recebida com sucesso!" });
    } catch (error) {
      
      console.error("Erro ao enviar mensagem de contato:", error);
      return res
        .status(500)
        .json({ error: "Erro ao enviar mensagem de contato." });
    }
  }
}

module.exports = new ContactController();
