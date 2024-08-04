"use server";

import * as z from "zod";
import { getTwoFactorAddByEmail } from "@/data/two-factor-add";
import {
  generateToggleTwoFactorToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  sendToggleTwoFactorEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { currentUser } from "@/lib/user";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  deleteAccountSettingsSchema,
  generalSettingsSchema,
  securitySettingsSchema,
} from "@/schemas/settings-schemas";
import { update } from "@/auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const settingsSendVerifyEmail = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
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
  const name = user.name ? user.name : "Esteemed individual";
  const verificationToken = await generateVerificationToken(user.email);
  await sendVerificationEmail(
    name,
    verificationToken.email,
    verificationToken.token
  );

  return { success: "An email has been sent with a verification link." };
};

export const settingsSendTwoFactorEmail = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
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
  const addTwoFactorToken = await generateToggleTwoFactorToken(user.email);
  await sendToggleTwoFactorEmail(
    addTwoFactorToken.email,
    addTwoFactorToken.token,
    user.isTwoFactorEnabled
  );
  return {
    success: `An email has been sent to ${user.email}`,
  };
};

export const generalSettings = async (
  values: z.infer<typeof generalSettingsSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized." };
  }
  const validatedFields = generalSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    image,
    name,
    username,
    phoneNumber,
    publicEmail,
    dateOfBirth,
    allowFollow,
  } = validatedFields.data;
  if (!name && dbUser.name) {
    return { error: "You cannot remove your name." };
  }

  if (!phoneNumber && dbUser.phoneNumber) {
    return { error: "You cannot remove your phone number." };
  }

  if (!publicEmail && dbUser.publicEmail) {
    return { error: "You cannot remove your public email." };
  }

  if (!username && dbUser.username) {
    return { error: "You cannot remove your username." };
  }

  if (!dateOfBirth && dbUser.dateOfBirth) {
    return { error: "You cannot remove your date of birth." };
  }
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...validatedFields.data,
    },
  });
  update({
    user: {
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      image: updatedUser.image,
    },
  });
  return { success: "Settings Updated!" };
};

export const securitySettings = async (
  values: z.infer<typeof securitySettingsSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized." };
  }
  if (dbUser.isOAuth) {
    return {
      error: "You cannot change the security information of an OAuth account.",
    };
  }
  const validatedFields = securitySettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  if (!email) {
    return { error: "You cannot remove your security email." };
  }

  type newValuesType = {
    isTwoFactorEnabled?: boolean | undefined;
    emailVerified?: Date | null | undefined;
    email?: string | undefined;
    password?: string | undefined;
  };
  if (user.email && user.isTwoFactorEnabled) {
    if (!code) {
      const twoFactorCode = await generateTwoFactorToken(user.email);
      await sendTwoFactorEmail(twoFactorCode.email, twoFactorCode.token);
      return { twoFactorCode: true };
    } else {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

      if (!twoFactorToken) {
        return { twoFactorError: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { twoFactorError: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { twoFactorError: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
    }
  }
  if (values.password && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (passwordMatch) {
      return {
        error: "Your new password is your old password.",
      };
    }
    const hashedPassword = await bcrypt.hash(values.password, 10);
    values.password = hashedPassword;
  }
  let newValues: newValuesType = {
    email: values.email,
    password: values.password,
  };
  newValues.emailVerified = undefined;
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }
    newValues.emailVerified = null;
    newValues.isTwoFactorEnabled = false;
  }
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...newValues,
    },
  });
  update({
    user: {
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      emailVerified: !!updatedUser.emailVerified,
    },
  });

  return { success: "Settings updated!" };
};

export const deleteAccount = async (
  values: z.infer<typeof deleteAccountSettingsSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized." };
  }

  const validatedFields = deleteAccountSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid code!" };
  }

  const code = values.code;

  if (user.email && user.isTwoFactorEnabled) {
    if (!code) {
      const existingToken = await getTwoFactorTokenByEmail(user.email);
      if (existingToken) {
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
          const twoFactorCode = await generateTwoFactorToken(user.email);
          await sendTwoFactorEmail(twoFactorCode.email, twoFactorCode.token);
          return { twoFactorCode: true };
        } else {
          return {
            existingTwoFactorCode: "Please check your email for your code.",
          };
        }
      } else {
        const twoFactorCode = await generateTwoFactorToken(user.email);
        await sendTwoFactorEmail(twoFactorCode.email, twoFactorCode.token);
        return { twoFactorCode: true };
      }
    } else {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

      if (!twoFactorToken) {
        return { twoFactorError: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { twoFactorError: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { twoFactorError: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
    }
  }

  const deletedUser = await db.user.delete({
    where: { id: user.id },
  });

  return { success: "Account successfully deleted. Redirecting..." };
};
