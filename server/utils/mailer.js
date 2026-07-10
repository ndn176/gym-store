import nodemailer from 'nodemailer';

let transporter = null;
let warnedMissingSmtp = false;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const t = getTransporter();

  if (!t) {
    if (!warnedMissingSmtp) {
      console.log(
        '[mailer] SMTP_HOST chưa được cấu hình trong .env — email sẽ chỉ được in ra console (chế độ dev).'
      );
      warnedMissingSmtp = true;
    }
    console.log(`\n[mailer] --- EMAIL (dev fallback) ---\nTo: ${to}\nSubject: ${subject}\n${html}\n---\n`);
    return;
  }

  await t.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@ironandaesthetic.com',
    to,
    subject,
    html,
  });
}

export async function sendPasswordResetCodeEmail(to, code) {
  await sendMail({
    to,
    subject: 'Mã đặt lại mật khẩu — Iron & Aesthetic',
    html: `
      <p>Mã xác minh đặt lại mật khẩu của bạn là:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:6px;">${code}</p>
      <p>Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
  });
}
