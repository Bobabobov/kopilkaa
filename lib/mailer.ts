import nodemailer from "nodemailer";

/** Достаточно задать SMTP-хост; порт/логин/пароль — по провайдеру (см. .env.example). */
export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function createSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    throw new Error("[mailer] Не задан SMTP_HOST");
  }

  const port = Number(process.env.SMTP_PORT || "587") || 587;
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS ?? "";

  // См. документацию nodemailer: порт 587 — STARTTLS (secure: false), 465 — implicit TLS.
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
    requireTLS: !secure && port === 587,
    tls: {
      minVersion: "TLSv1.2",
    },
  });
}

function pickSmtpErrMeta(
  err: unknown,
): Record<string, string | number | undefined> {
  if (!err || typeof err !== "object") {
    return { message: String(err) };
  }
  const o = err as Record<string, unknown>;
  const response =
    typeof o.response === "string"
      ? o.response.length > 800
        ? `${o.response.slice(0, 800)}…`
        : o.response
      : undefined;
  return {
    message: typeof o.message === "string" ? o.message : String(err),
    code: typeof o.code === "string" ? o.code : undefined,
    command: typeof o.command === "string" ? o.command : undefined,
    responseCode:
      typeof o.responseCode === "number" ? o.responseCode : undefined,
    response,
  };
}

export async function sendTransactionalMail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const from =
    process.env.MAIL_FROM?.trim() ||
    "Kopilka Online <support@kopilka-online.ru>";
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || "587") || 587;

  const transport = createSmtpTransport();
  try {
    const info = await transport.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    if (process.env.MAIL_LOG_ACCEPTED === "1") {
      console.info("[mailer] письмо принято SMTP-сервером", {
        to: params.to,
        messageId: info.messageId,
        host,
        port,
      });
    }
  } catch (err) {
    console.error("[mailer] ошибка отправки SMTP", {
      to: params.to,
      from,
      host,
      port,
      ...pickSmtpErrMeta(err),
    });
    throw err;
  }
}
