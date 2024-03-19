import * as z from "zod";
import { phoneRegex } from "./listing-schemas";

export const generalSettingsSchema = z.object({
  image: z.optional(z.string()),
  name: z.optional(z.string()),
  username: z.optional(z.string()),
  phoneNumber: z
    .optional(z.string().regex(phoneRegex, "Invalid phone number!"))
    .or(z.literal("")),
  publicEmail: z.optional(z.string().email()).or(z.literal("")),
  dateOfBirth: z.optional(z.coerce.date()),
  allowFollow: z.optional(z.boolean()),
});
