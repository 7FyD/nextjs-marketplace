import * as z from "zod";
import { phoneRegex } from "./listing-schemas";

export const generalSettingsSchema = z.object({
  image: z.optional(z.string()),
  name: z
    .optional(
      z.string().min(2, "Your new name must contain at least 2 characters.")
    )
    .or(z.literal("")),
  username: z
    .optional(
      z.string().min(2, "Your new username must contain at least 2 characters.")
    )
    .or(z.literal("")),
  phoneNumber: z
    .optional(z.string().regex(phoneRegex, "Invalid phone number!"))
    .or(z.literal("")),
  publicEmail: z.optional(z.string().email()).or(z.literal("")),
  dateOfBirth: z.optional(z.coerce.date()),
  allowFollow: z.optional(z.boolean()),
});

export const securitySettingsSchema = z.object({
  email: z.optional(z.string().email()).or(z.literal("")),
  password: z
    .optional(
      z.string().min(6, "Your new password must contain at least 6 characters.")
    )
    .or(z.literal("")),
});
