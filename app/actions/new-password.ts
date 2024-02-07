"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas/user-schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Password reset token does not exist." };
  }

  const hasExpired = new Date(existingToken.expires) <= new Date();
  if (hasExpired) {
    return {
      error: "Token expired. Please request another password reset token.",
    };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser || !existingUser.password)
    return { error: "User does not exist." };

  const hashedPassword = await bcrypt.hash(values.password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Password successfully updated.'\n'Feel free to login." };
};
