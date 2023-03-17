import nodemailer from 'nodemailer';
import { Response } from 'express';
import { EMAIL_ADDRESS, EMAIL_PASSWORD } from '../pre-start/constants';
import { content } from '../html';

async function sendResetToken(email: string, token: string, response: Response) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_ADDRESS,
      to: email,
      subject: 'Comunizika - Restauração de senha',
      html: content({ token: token })
    });

    return response
      .status(parseInt(info.response.split(" ")[0]))
      .send(info.response.split(" ")[2])
      .end();
  } catch (error) {
    return response.status(500).send(error).end();
  }
}

export { sendResetToken };