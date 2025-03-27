const nodemailer = require("nodemailer");
const config = require("config");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendEmail(toEmail, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "SportUZ akkauntini faollashtirish",
      text: "",
      html: `
      <div> 
        <h2> Lugatim akkauntini faollashtirish uchun otp kod: </h1> 
        <h1>${otp}</h1>
      </div>
      `,
    });
  }
}

module.exports = new EmailService();
