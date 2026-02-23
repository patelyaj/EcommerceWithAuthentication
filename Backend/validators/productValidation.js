// validations/product.validation.js

import { z } from "zod";

export const productValidationSchema = z.object({
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid URL"),

  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  brand: z
    .string()
    .min(3, "Brand must be at least 3 characters"),

  category: z
    .string()
    .min(3, "Category is required must be 3 characters"),

  rating: z
    .number()
    .min(0)
    .max(5),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  discountPercentage: z
    .number()
    .min(0)
    .max(100),

  availabilityStatus: z.enum([
    "In Stock",
    "Low Stock",
    "Out of Stock"
  ])
});