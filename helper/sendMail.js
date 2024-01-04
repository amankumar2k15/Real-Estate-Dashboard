"use strict";
const nodemailer = require("nodemailer");

require('dotenv').config()

async function sendMail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.USER_DETAILS,
      pass: process.env.PASS,
    },
  });

 await transporter.sendMail({
    from: process.env.USER_DETAILS,
    to: to,
    subject: subject,
    text: text,
  });
}

module.exports = sendMail;
