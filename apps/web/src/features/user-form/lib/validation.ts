import { z } from "zod";
import { PHONE_REG_EXP } from "../../../shared/lib/regexp";

export const userSchema = z.object({
  name: z.string(),
  phone: z.string().regex(PHONE_REG_EXP, { message: "Invalid phone number" }).or(z.literal("")),
  telegram: z.string().url({ message: "Invalid URL" }).or(z.literal("")),
});
