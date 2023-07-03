import nodemailer from 'nodemailer';
import { Response } from 'express';
import {ORIGIN, BASE_PATH} from '../pre-start/constants';
import { EMAIL_ADDRESS, EMAIL_PASSWORD } from '../pre-start/constants';
import fs from 'fs/promises';
import path from 'path';

async function sendEmail(toEmail: string, content: string, subject: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  return await transporter.sendMail({
    from: EMAIL_ADDRESS,
    to: toEmail,
    subject: subject,
    html: content
  });
}

async function sendResetToken(toEmail: string, token: string, response: Response) {
  const emailHtml = await fs.readFile(path.resolve(__dirname, "../html/sendToken.html"), 'utf8');
  const email = emailHtml.replaceAll("$token", token);
  const info = await sendEmail(toEmail, email, 'Comunizika - Recuperação de senha');

  return response
    .status(parseInt(info.response.split(" ")[0]))
    .send(info.response.split(" ")[2])
    .end();
}

async function sendResetNotification(toEmail: string, response: Response) {
  const email = await fs.readFile(path.resolve(__dirname, "../html/resetConfirmation.html"), 'utf8');
  const info = await sendEmail(toEmail, email, 'Comunizika - Senha alterada');

  return response
    .status(parseInt(info.response.split(" ")[0]))
    .send(info.response.split(" ")[2])
    .end();
}

async function sendDeleteAccount(toEmail: string, response: Response, email: string, token: string) {
  const url = ORIGIN + BASE_PATH + `/delete-account/delete?email=${email}&token=${token}`;
  let emailHtml = await fs.readFile(path.resolve(__dirname, "../html/deleteAccountEmail.html"), 'utf8');
  emailHtml = emailHtml.replace("&url", url);
  const info = await sendEmail(toEmail, emailHtml, 'Comunizika - Exclusão da conta');

  return response
    .status(parseInt(info.response.split(" ")[0]))
    .sendFile(path.join(__dirname, "../html/emailSent.html"));
}

export { sendResetToken, sendResetNotification, sendDeleteAccount };