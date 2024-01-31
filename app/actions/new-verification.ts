"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Verification token does not exist." };
  }

  const hasExpired = new Date(existingToken.expires) <= new Date();
  if (hasExpired) {
    return {
      error: "Token expired. Please request another email verification token.",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  // add an optional oldEmaiil? string on the new-verification token in database and if there is one, get it
  return { success: "Email verified." };
};
