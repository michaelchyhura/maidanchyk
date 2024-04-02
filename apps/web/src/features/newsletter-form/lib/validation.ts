import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().min(1, "Обов'язкове поле").email("Неправильний email"),
});
