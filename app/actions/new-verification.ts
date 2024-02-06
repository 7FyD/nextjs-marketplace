"use server";

import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { currentUser } from "@/lib/user";

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
    const user = await currentUser();
    if (!user) return { error: "User does not exist." };
    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "User does not exist." };
    if (!user.email) return { error: "Your account does not use email." };

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), email: existingToken.email },
    });
  } else
    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: existingToken.email },
    });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Email verified." };
};
