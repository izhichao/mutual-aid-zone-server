const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: '465',
  secureConnection: true,
  secure: true,
  auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }
});