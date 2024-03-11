import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
  password: z.string().min(6, { message: "Password is required" }),
});
