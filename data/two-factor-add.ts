import { db } from "@/lib/db";

export const getTwoFactorAddByToken = async (token: string) => {
  try {
    const twoFactorAddToken = await db.addTwoFactorToken.findUnique({
      where: { token },
    });

    return twoFactorAddToken;
  } catch {
    return null;
  }
};

export const getTwoFactorAddByEmail = async (email: string) => {
  try {
    const twoFactorAddToken = await db.addTwoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorAddToken;
  } catch {
    return null;
  }
};
