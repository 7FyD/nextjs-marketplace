"use server";

import * as z from "zod";
import { SettingsNewPasswordSchema, SettingsChangeNameSchema } from "@/schemas";
import { getTwoFactorAddByEmail } from "@/data/two-factor-add";
import {
  generateAddTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendAddTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { currentUser } from "@/lib/user";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const settingsVerifyEmail = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!user.email) {
    return { error: "Account does not use email." };
  }

  if (user.emailVerified) {
    return { error: "Email already verified." };
  }

  const verificationToken = await generateVerificationToken(user.email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { inform: "An email has been sent with a verification link." };
};

export const settingsToggleTwoFA = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!user.email) {
    return { error: "Account does not use email." };
  }

  if (!user.emailVerified) {
    return { error: "Email must be verified in order to activate 2FA." };
  }

  if (user.isTwoFactorEnabled) {
    await db.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: false },
    });

    return { success: "Two factor authentification disabled." };
  }

  const existingToken = await getTwoFactorAddByEmail(user.email);
  if (existingToken) {
    const createdAt = existingToken?.createdAt.getTime();
    if (new Date(createdAt + 5 * 60 * 1000) > new Date()) {
      const timeNow = new Date();
      const diffTime = createdAt + 5 * 60 * 1000 - timeNow.getTime();
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      const diffSeconds = Math.ceil(diffTime / 1000) % 60;
      return {
        error: `You have already sent a request. Please check your email or try again in ${diffMinutes} minutes and ${diffSeconds} seconds.`,
      };
    }
  }
  const addTwoFactorToken = await generateAddTwoFactorToken(user.email);
  await sendAddTwoFactorEmail(addTwoFactorToken.email, addTwoFactorToken.token);
  return {
    inform:
      "An email has been sent with your 2 factor authentification confirmation link.",
  };
};

export const settingsChangePassword = async (
  values: z.infer<typeof SettingsNewPasswordSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!dbUser.password) {
    return { error: "Account does not use password." };
  }

  if (!values.oldPassword || !values.password) {
    return { error: "Invalid fields." };
  }

  const validPassword = await bcrypt.compare(
    values.oldPassword,
    dbUser.password
  );
  if (!validPassword) {
    return { error: "Incorrect password." };
  }
  const validatedFields = SettingsNewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid new password." };
  }
  const hashedPassword = await bcrypt.hash(values.password, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  return { success: "Password succesfully changed." };
};

export const settingsChangeName = async (
  values: z.infer<typeof SettingsChangeNameSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!values) {
    return { error: "New name is required." };
  }

  const validatedFields = SettingsChangeNameSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid new name." };
  }
  await db.user.update({
    where: { id: user.id },
    data: { name: values.name },
  });
  return { success: "Name successfully changed." };
};
