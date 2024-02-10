import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

enum Condition {
  NONE = "None",
  NEW = "New",
  EXCELLENT = "Excellent",
  GOOD = "Good",
  USED = "Used",
  Broken = "Broken",
}

export const NewListingSchema = z.object({
  title: z.string().min(2, {
    message: "A title of minimum 2 characters is required.",
  }),
  description: z.string().min(16, {
    message: "A description of minimum 16 characters is required.",
  }),
  price: z.coerce
    .number()
    .nonnegative({
      message: "Please input a price >= $0.",
    })
    .finite(),
  imageUrl: z.string().min(1, {
    message: "Image is required.",
  }),
  category: z.string().min(1, {
    message: "Please choose your item's category.",
  }),
  condition: z.nativeEnum(Condition),
  country: z.string().min(2, {
    message: "Please specify your country.",
  }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
  email: z.string().email(),
});
