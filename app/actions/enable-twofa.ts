import { getTwoFactorAddByToken } from "@/data/two-factor-add";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const enableTwoFactor = async (token: string) => {
  if (!token) {
    return { error: "Missing token." };
  }

  const existingToken = await getTwoFactorAddByToken(token);
  if (!existingToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = existingToken.expires < new Date();
  if (hasExpired) {
    return { error: "Token has expired." };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User does not exist." };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { isTwoFactorEnabled: true },
  });

  await db.addTwoFactorToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Two factor authentification has been enabled." };
};
