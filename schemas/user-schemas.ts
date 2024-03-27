import * as z from "zod";

import { phoneRegex } from "./listing-schemas";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(2, {
    message: "Name is required. Minimum 2 characters",
  }),
  username: z.string().min(2, {
    message: "Username is required. Minimum 2 characters",
  }),
  publicEmail: z.optional(
    z
      .string()
      .email({
        message: "Public email invalid",
      })
      .or(z.literal(""))
  ),
  phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
  dateOfBirth: z.date(),
});

export const ReportFormSchema = z.object({
  userId: z.string(),
  type: z.enum(["name", "photo", "listing", "impersonation", "scam"], {
    required_error: "You need to select a report type.",
  }),
});
