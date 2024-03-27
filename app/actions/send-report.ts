"use server";

import * as z from "zod";
import { ReportFormSchema } from "@/schemas/user-schemas";
import { currentUser } from "@/lib/user";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export const sendReport = async (values: z.infer<typeof ReportFormSchema>) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized." };
    }

    const validatedFields = ReportFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid report" };
    }

    const reportedUser = await getUserById(values.userId);
    {
      if (!reportedUser) {
        return { error: "Invalid report" };
      }
    }

    const existingReport = await db.notification.findFirst({
      where: {
        type: "REPORT",
        nameId: values.userId,
        reporter: user.id,
      },
    });

    if (existingReport) {
      return {
        error:
          "You have already sent a report against this user. Please wait until your last one is resolved before sending a new one.",
      };
    }

    const adminUsers = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
    });

    adminUsers.map(async (adminUser) => {
      await db.notification.create({
        data: {
          userId: adminUser.id,
          type: "REPORT",
          title: `${
            values.type.charAt(0).toUpperCase() + values.type.slice(1)
          } report`,
          name: reportedUser.name ? reportedUser.name : values.userId,
          nameId: values.userId,
          reporter: user.id,
        },
      });
    });
    return { success: "User successfully reported." };
  } catch (error: any) {
    throw new Error(error);
  }
};
