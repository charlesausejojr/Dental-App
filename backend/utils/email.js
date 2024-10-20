import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export async function sendAppointmentReminder(to, subject, text) {
  await transporter.sendMail({
    from: config.email.user,
    to,
    subject,
    text,
  });
}
