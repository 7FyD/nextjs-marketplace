import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new_verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}"here</a> to confirm email.</p>
    <p>This code will expire in one hour.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new_password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>This code will expire in one hour.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Authentification Code",
    html: `<p>Your Two Factor Authentification code is ${token}.</p>
    <p>This code will expire in 5 minutes.</p>
    `,
  });
};

export const sendAddTwoFactorEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/enable_2fa?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Activate 2FA",
    html: `<p>Click <a href="${confirmLink}"here</a> to confirm email.</p>
    <p>This code will expire in one hour.</p>`,
  });
};
