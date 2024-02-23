import { User } from "next-auth";

export type ExtendedUser = {
  role: "ADMIN" | "USER";
  emailVerified: boolean;
  isTwoFactorEnabled: boolean;
  favoriteIds: string[];
} & User;
