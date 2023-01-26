import nodemailer from "nodemailer";
import { Response } from "express";
import { GMAIL_EMAIL, GMAIL_PASSWORD } from "../pre-start/constants";

interface content {
  title: string;
  html: string;
}

export default async function resetMessageSend(
  toEmail: string,
  content: content,
  response: Response
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: GMAIL_EMAIL, // sender address
      to: toEmail, // list of receivers
      subject: content.title, // Subject line
      html: content.html, // html body
    });

    return response
      .send(info.response.split(" ")[2])
      .status(parseInt(info.response.split(" ")[0]))
      .end();
  } catch (err) {
    return response.status(500).send(err).end();
  }
}
