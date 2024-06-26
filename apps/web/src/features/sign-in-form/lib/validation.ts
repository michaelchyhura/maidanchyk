import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Обов'язкове поле").email("Неправильний email"),
  password: z.string().min(1, "Обов'язкове поле"),
});
