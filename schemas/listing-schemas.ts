import { Condition, CountryEnum, Category, Currency } from "@/data/const-data";

import * as z from "zod";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const NewListingSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "A title of minimum 2 characters is required",
    })
    .max(32, {
      message: "A maximum of 32 characters are allowed for the title",
    }),
  description: z.string().min(16, {
    message: "A description of minimum 16 characters is required",
  }),
  category: z.nativeEnum(Category, {
    errorMap: (issue, ctx) => {
      return { message: "Please select your item's category" };
    },
  }),
  currency: z.nativeEnum(Currency, {
    errorMap: (issue, ctx) => {
      return { message: "Please select your item's desired currency" };
    },
  }),
  price: z.coerce
    .number()
    .nonnegative({
      message: "Please input a price >= 0",
    })
    .finite()
    .refine(
      (n) => {
        if (n % 1 === 0) return true;
        else return n.toString().split(".")[1].length <= 2;
      },
      { message: "Maximum 2 decimals allowed" }
    ),
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.nativeEnum(CountryEnum, {
    errorMap: (issue, ctx) => {
      return { message: "Please select a country" };
    },
  }),

  details: z.string().min(1, {
    message: "Field missing",
  }),
  optionalDetails: z
    .optional(z.string().min(1, "Invalid field input"))
    .or(z.literal("")),

  email: z.string().email(),
});
