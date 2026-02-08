import nodemailer from "nodemailer";
import logger from "../utils/loggerService.js";
import { buildTemplate } from "../utils/emailTemplates.js";

const buildTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSKEY;
  const secure =
    String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

const sendMail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM;
  const transport = buildTransport();

  if (!from || !transport) {
    return false;
  }

  try {
    await transport.sendMail({ from, to, subject, html, text });
    return true;
  } catch (err) {
    const errMessage = err?.message || "Unknown SMTP error";
    logger.error(`SMTP send failed: ${errMessage}`, {
      err,
      code: err?.code,
      response: err?.response,
      responseCode: err?.responseCode,
      message: errMessage,
    });
    return false;
  }
};

const sendEmailSafe = async (sendFn, email, code) => {
  try {
    return await sendFn(email, code);
  } catch {
    return false;
  }
};

const sendVerificationCodeEmail = async (email, code) => {
  const subject = "Your PlanYU verification code";
  const text = `Your verification code is: ${code}`;
  const html = buildTemplate({
    title: "Verify your email",
    intro:
      "Thanks for signing up. Use the code below to verify your email address.",
    code,
    note: "This code expires in 10 minutes.",
  });

  return sendMail({ to: email, subject, html, text });
};

const sendLoginCodeEmail = async (email, code) => {
  const subject = "Your PlanYU login code";
  const text = `Your login code is: ${code}`;
  const html = buildTemplate({
    title: "Complete your login",
    intro: "Enter the code below to finish signing in to your account.",
    code,
    note: "This code expires in 10 minutes.",
  });

  return sendMail({ to: email, subject, html, text });
};

export {
  sendMail,
  sendEmailSafe,
  sendVerificationCodeEmail,
  sendLoginCodeEmail,
};
