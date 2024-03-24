import { Condition, CountryEnum } from "@/data/const-data";

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
  price: z.coerce
    .number()
    .nonnegative({
      message: "Please input a price >= $0",
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
    message: "Image is required.",
  }),
  category: z.string().min(1, {
    message: "Please select your item's category",
  }),
  condition: z.nativeEnum(Condition, {
    errorMap: (issue, ctx) => {
      return { message: "Please select your item's condition" };
    },
  }),
  country: z.nativeEnum(CountryEnum, {
    errorMap: (issue, ctx) => {
      return { message: "Please select a country" };
    },
  }),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  email: z.string().email(),
});
