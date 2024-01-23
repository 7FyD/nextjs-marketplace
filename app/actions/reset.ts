"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }
  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {
      success:
        "If there's an account matching this email, a reset email has been sent.",
      // although its a fail, provide anonimity and don't tell the sender
      // that there is no email
    };
  }
  const resetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(resetToken.email, resetToken.token);
  return {
    success:
      "If there's an account matching this email, a reset email has been sent.",
  };
};
