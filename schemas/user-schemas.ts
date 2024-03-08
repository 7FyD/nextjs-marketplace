import * as z from "zod";

export const SettingsChangeNameSchema = z.object({
  name: z.string().min(2, {
    message: "New name is required. Minimum 2 characters.",
  }),
});

export const SettingsGeneralSchema = z.object({
  name: z.optional(
    z.string().min(2, {
      message: "Minimum of 2 characters required.",
    })
  ),
  imageUrl: z.optional(z.string()),
});

export const SettingsChangeEmailSchema = z.object({
  email: z.string().email({
    message: "New email is required.",
  }),
});

export const SettingsNewPasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Old password is required",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

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
    message: "Name is required. Minimum 2 characters.",
  }),
});
