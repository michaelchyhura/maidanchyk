import { z } from "zod";
import { CourtEvent } from "@maidanchyk/prisma";
import { PHONE_REG_EXP } from "../../../shared/lib/regexp";

export const courtSchema = z.object({
  name: z.string().min(1, "Обов'язкове поле").max(255, "Назва повинна бути менше ніж 255 символів"),
  description: z.string().min(1, "Обов'язкове поле"),
  price: z.string().min(1, "Обов'язкове поле"),
  events: z
    .array(
      z.enum([
        CourtEvent.BASKETBALL,
        CourtEvent.VOLLEYBALL,
        CourtEvent.MINI_FOOTBALL,
        CourtEvent.TENNIS,
        CourtEvent.BADMINTON,
        CourtEvent.HANDBALL,
        CourtEvent.MULTI_SPORT,
      ]),
    )
    .refine((value) => value.some((item) => item), {
      message: "Виберіть принаймні один вид активності",
    }),
  photos: z.array(z.any()).refine((value) => value.some((item) => item), {
    message: "Прикріпіть принаймні один файл",
  }),
  city: z
    .object({
      description: z.string(),
      place_id: z.string(),
      structured_formatting: z.object({
        main_text: z.string(),
        secondary_text: z.string(),
      }),
      types: z.array(z.string()),
    })
    .refine((value) => value, {
      message: "Обов'язкове поле",
    }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  contactPerson: z.string().min(1, "Обов'язкове поле"),
  contactEmail: z.string().min(1, "Обов'язкове поле").email("Неправильний email"),
  contactPhone: z
    .string()
    .min(1, "Обов'язкове поле")
    .regex(PHONE_REG_EXP, "Неправильний номер телефону"),
});
