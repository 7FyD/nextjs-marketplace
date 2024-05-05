import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new_verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}"here</a> to confirm email.</p>
    <p>This code will expire in one hour.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new_password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>This code will expire in one hour.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: "2FA Authentification Code",
    html: `<p>Your Two Factor Authentification code is ${token}.</p>
    <p>This code will expire in 5 minutes.</p>
    `,
  });
};

export const sendToggleTwoFactorEmail = async (
  email: string,
  token: string,
  isTwoFactorEnabled: boolean
) => {
  const confirmLink = `${domain}/auth/enable_2fa?token=${token}`;

  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: `${isTwoFactorEnabled ? "Disable" : "Activate"} 2FA`,
    html: `<p>Click <a href="${confirmLink}"here</a> to ${
      isTwoFactorEnabled ? "disable" : "activate"
    } two factor authentificator.</p>
    <p>This code will expire in one hour.</p>`,
  });
};
