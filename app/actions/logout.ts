"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  console.log("signed out");
  await signOut();
};
