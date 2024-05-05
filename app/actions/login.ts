"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas/user-schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// error codes: 0 internal error, 1 invalid login, 2 invalid 2FAcode

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", errorCode: "1" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email or password invalid.", errorCode: "1" };
  }

  // development only making sending verification email easier
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(existingUser.email, verificationToken.token);
  }

  // 2FA start
  if (existingUser.isTwoFactorEnabled && existingUser.emailVerified) {
    if (code) {
      // for the second submit of the login form
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken || code !== twoFactorToken.token) {
        return { error: "Invalid code!", errorCode: "2" };
      }

      const hasExpired = twoFactorToken.expires < new Date();
      if (hasExpired) {
        // if the token has expired, delete it, create a new one, send it and throw an error
        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });
        const newTwoFactorToken = await generateTwoFactorToken(
          existingUser.email
        );
        await sendTwoFactorEmail(
          newTwoFactorToken.email,
          newTwoFactorToken.token
        );
        return {
          error:
            "Authentification code has expired. Please check your email for a new one.",
          errorCode: "2",
        };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // in case this is the first submit of the form
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }
  // 2FA end

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Sucessfully logged in." };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email or password invalid.", errorCode: "1" };
        default: {
          return { error: "Something went wrong!", errorCode: "0" };
        }
      }
    }

    throw error;
  }
};
