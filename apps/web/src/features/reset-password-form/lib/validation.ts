import { z } from "zod";

export const forgotPasswordSchema = z.object({
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
});
