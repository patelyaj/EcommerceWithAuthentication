// validations/user.validation.js

import { z } from "zod";

export const userValidationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email format"),

  mobileno: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});
