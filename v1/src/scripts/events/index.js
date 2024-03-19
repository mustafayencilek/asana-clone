const eventEmitter = require("./eventEmitter");
const nodemailer = require("nodemailer");
module.exports = () => {
  eventEmitter.on("send_email", async (emailData) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...emailData,
    });
    console.log("Message sent: %s", info.messageId);
  });
};
