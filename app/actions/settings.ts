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

  const verificationToken = await generateVerificationToken(user.email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

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

// export const settingsChangePassword = async (
//   values: z.infer<typeof SettingsNewPasswordSchema>
// ) => {
//   const user = await currentUser();
//   if (!user || !user.id) {
//     return { error: "Unauthorized." };
//   }

//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" };
//   }

//   if (!dbUser.password) {
//     return { error: "Account does not use password." };
//   }

//   if (!values.oldPassword || !values.password) {
//     return { error: "Invalid fields." };
//   }

//   const validPassword = await bcrypt.compare(
//     values.oldPassword,
//     dbUser.password
//   );
//   if (!validPassword) {
//     return { error: "Incorrect password." };
//   }
//   const validatedFields = SettingsNewPasswordSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid new password." };
//   }
//   const hashedPassword = await bcrypt.hash(values.password, 10);
//   await db.user.update({
//     where: { id: user.id },
//     data: { password: hashedPassword },
//   });
//   return { success: "Password succesfully changed." };
// };

// export const settingsGeneral = async (
//   values: z.infer<typeof SettingsGeneralSchema>
// ) => {
//   const user = await currentUser();
//   if (!user || !user.id) {
//     return { error: "Unauthorized." };
//   }

//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" };
//   }

//   if (!values) {
//     return { error: "New name is required." };
//   }

//   const validatedFields = SettingsGeneralSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid input." };
//   }
//   await db.user.update({
//     where: { id: user.id },
//     data: { name: values.name },
//   });
//   return { success: "Name successfully changed." };
// };

// export const settingsChangeEmail = async (
//   values: z.infer<typeof SettingsChangeEmailSchema>
// ) => {
//   // add an optional oldEmaiil? string on the new-verification token in database and if there is one, get it
//   const user = await currentUser();
//   if (!user || !user.id) {
//     return { error: "Unauthorized." };
//   }

//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" };
//   }

//   if (!user.email) {
//     return { error: "Account does not use email." };
//   }

//   const validatedFields = SettingsChangeEmailSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid new email." };
//   }

//   const existingUser = await getUserByEmail(values.email);

//   if (existingUser) {
//     return { error: "Email already in use!" };
//   }

//   const verificationToken = await generateVerificationToken(values.email);
//   await sendVerificationEmail(verificationToken.email, verificationToken.token);

//   return {
//     inform: "A verification email has been sent to your new mail addresss.",
//   };
// };

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
  if (!name || !phoneNumber || !publicEmail) {
    // TODO: implement better solution
    return { error: "You cannot leave empty fields." };
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
