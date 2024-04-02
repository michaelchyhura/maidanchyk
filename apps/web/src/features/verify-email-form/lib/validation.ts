import { z } from "zod";

export const verifyEmailSchema = z.object({
  code: z.string().min(6, "Ваш код підтвердження повинен містити 6 символів"),
});
