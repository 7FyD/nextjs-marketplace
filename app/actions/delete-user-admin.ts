"use server";

import * as z from "zod";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { NewPasswordSchema } from "@/schemas/user-schemas";
import bcrypt from "bcryptjs";

export const deleteUser = async (
  id: string,
  values: z.infer<typeof NewPasswordSchema>
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const user = await currentUser();
  if (!user) {
    return { error: "Invalid access" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Invalid access" };
  }

  if (!dbUser.isOAuth && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordsMatch) {
      return { error: "Invalid password confirmation" };
    }
  }

  if (id === user.id) {
    return { error: "You cannot ban yourself..." };
  }
  if (user.role !== "ADMIN") {
    return { error: "Invalid access" };
  }
  const targetUser = await getUserById(id);
  if (!targetUser) {
    return { error: "Invalid request" };
  }
  if (targetUser.role === "ADMIN") {
    return { error: "You cannot ban another admin" };
  }

  const deletedUser = await db.user.delete({
    where: {
      id,
    },
  });

  return { success: "User successfully deleted. Redirecting..." };
};
