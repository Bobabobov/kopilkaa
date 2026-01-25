// lib/email.ts
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "";
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";
const from = process.env.MAIL_FROM || "no-reply@example.com";

// Можно принудительно выключить письма переменной MAIL_ON=0
// Включается через переменную окружения MAIL_ON=1
const MAIL_ON = process.env.MAIL_ON === "1";

// Почта включается только если (вкл) и заданы все ключи
const MAIL_ENABLED = MAIL_ON && Boolean(host && user && pass);

const mailer = MAIL_ENABLED
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 - SSL, 587/25 - STARTTLS
      auth: { user, pass },
      // чтобы не зависать, когда провайдер недоступен:
      connectionTimeout: 3000,
      greetingTimeout: 3000,
      socketTimeout: 5000,
    })
  : null;

type Status = "PENDING" | "APPROVED" | "REJECTED";

export function statusSubject(status: Status) {
  switch (status) {
    case "PENDING":
      return "Ваша заявка принята в обработку";
    case "APPROVED":
      return "Ваша заявка одобрена";
    case "REJECTED":
      return "Ваша заявка отклонена";
  }
}

export function statusHtml(opts: {
  title: string;
  status: Status;
  comment?: string | null;
}) {
  const { title, status, comment } = opts;
  const statusText =
    status === "PENDING"
      ? "В обработке"
      : status === "APPROVED"
        ? "Одобрено"
        : "Отказано";
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111">
    <h2 style="margin:0 0 12px">Статус вашей заявки обновлён</h2>
    <div style="padding:12px;border:1px solid #eee;border-radius:12px">
      <div><strong>Заявка:</strong> ${escapeHtml(title)}</div>
      <div><strong>Статус:</strong> ${statusText}</div>
      ${comment ? `<div style="margin-top:8px"><strong>Комментарий:</strong> ${escapeHtml(comment)}</div>` : ""}
    </div>
    <p style="color:#555;margin-top:16px">Спасибо, что пользуетесь «Копилкой».</p>
  </div>`;
}

export async function sendStatusEmail(
  to: string,
  data: { title: string; status: Status; comment?: string | null },
) {
  if (!MAIL_ENABLED || !mailer) {
    return;
  }

  await mailer.sendMail({
    from,
    to,
    subject: statusSubject(data.status),
    html: statusHtml(data),
  });
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (ch) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as Record<string, string>
      )[ch],
  );
}
