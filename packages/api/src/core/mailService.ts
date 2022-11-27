import nodemailer from 'nodemailer';
import type { IMailService } from '../types';

const getTransport = () => {
  return nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const mailerService: IMailService = {
  sendMail({ to, template }) {
    const transporter = getTransport();
    console.log('hello ?');
    return transporter
      .sendMail({
        from: 'dotz@gmail.com',
        to,
        subject: template.subject,
        html: template.body
      })
      .then(result => {
        console.log('mail sent', result);
      });
  }
};
