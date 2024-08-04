import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new_verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: "Confirm your email",
    html: `
      <div style="width: full; text-align: center">
        <p>Hi ${name},</p>
        <p>Click the following button to confirm your email address:</p>
        <br/>
        <a href="${confirmLink}"  
          style="
            background-color: black;
            border-radius: 9999px;
            padding: 14px;
            font-size: 14px;
            text-decoration: none;
            color: white;
            margin-left: auto;
            margin-right: auto;
            display: block;
            max-width: fit-content;
          " 
        >
          Confirm Email
        </a>

        <p>If the button doesn't work, you can copy and paste the following URL into your browser: ${confirmLink}</p>

        <p>If you did not create an account with us, please ignore this email.</p>


        <p>Best regards,</p>

        <p>7FyD.dev</p>
      </div>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new_password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@7fyd.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="width: full; text-align: center">
        <p>Hi there,</p>
        <p>Click the following button to reset your password:</p>
        <a href="${resetLink}"  
          style="
            background-color: black;
            border-radius: 9999px;
            padding: 14px;
            font-size: 14px;
            text-decoration: none;
            color: white;
            margin-left: auto;
            margin-right: auto;
            display: block;
            max-width: fit-content;
          " 
        >
          Reset password
        </a>

        <p>If the button doesn't work, you can copy and paste the following URL into your browser: ${resetLink}</p>

        <p>This code will expire in an hour. </p>

        <p>If you did not request a password reset, please ignore this email.</p>


        <p>Best regards,</p>

        <p>7FyD.dev</p>
      </div>`,
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
    subject: `${isTwoFactorEnabled ? "Disable" : "Enable"} 2FA`,
    /* `<p>Click <a href="${confirmLink}"here</a> to ${
      isTwoFactorEnabled ? "disable" : "enable"
    } two factor authentificator.</p>
    <p>This code will expire in one hour.</p>`, */
    html: `  
      <div style="width: full; text-align: center">
        <p>Hey, </p>
        <p>Click the following button to ${
          isTwoFactorEnabled ? "disable" : "enable"
        } two factor authentification:</p>
        <a href="${confirmLink}"  
        style="
          background-color: black;
          border-radius: 9999px;
          padding: 14px;
          font-size: 14px;
          text-decoration: none;
          color: white;
          margin-left: auto;
          margin-right: auto;
          display: block;
          max-width: fit-content;
        " 
        >
          ${isTwoFactorEnabled ? "Disable" : "Enable"} 2FA
        </a>

        <p>If the button doesn't work, you can copy and paste the following URL into your browser: ${confirmLink}</p>

        <p>If you did not create this request, please promptly change your password or contact customer support.</p>


        <p>Best regards,</p>

        <p>7FyD.dev</p>
      </div>`,
  });
};
