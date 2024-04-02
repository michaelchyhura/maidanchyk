import { UserRole } from "@maidanchyk/prisma";
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().min(1, "Обов'язкове поле").email("Неправильний email"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
  role: z.enum([UserRole.COURT_OWNER, UserRole.PLAYER], { required_error: "Обов'язкове поле" }),
});
