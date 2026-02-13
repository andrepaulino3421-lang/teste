import nodemailer from 'nodemailer';

export async function sendResetEmail(to: string, link: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Reset de senha - PrecificaPro',
    text: `Use este link para redefinir sua senha: ${link}`
  });

  return true;
}
