const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: '465',
  secureConnection: true,
  secure: true,
  auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }
});

function sendMail({ email, title, text }) {
  transporter.sendMail({
    subject: `[互助圈] ${title}`,
    from: `互助圈 ${process.env.EMAIL_USERNAME}`,
    to: `${email}`,
    text
  });
}
module.exports = sendMail;
