const nodemailer = require("nodemailer");
// Importing this module never opens a connection. Local development uses Mailpit.
const options = process.env.EMAIL_SERVICE
  ? { service: process.env.EMAIL_SERVICE }
  : {
      host: process.env.SMTP_HOST || "127.0.0.1",
      port: Number(process.env.SMTP_PORT || 1025),
      secure: process.env.SMTP_SECURE === "true",
    };
if (process.env.EMAIL_USER && process.env.EMAIL_PASS)
  options.auth = { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS };
module.exports = nodemailer.createTransport(options);
