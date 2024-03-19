import { z } from "zod";
import { CourtEvent } from "@maidanchyk/prisma";
import { PHONE_REG_EXP } from "../../../shared/lib/regexp";

export const courtSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "Name should be less then 60 characters long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description should be less then 255 characters long"),
  price: z.string().min(1, "Price is required"),
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
      message: "You have to select at least one event type",
    }),
  photos: z.array(z.any()).refine((value) => value.some((item) => item), {
    message: "You need to attach at least one file",
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
      message: "City is required",
    }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  contactPerson: z.string().min(1, "Contact Person is required"),
  contactEmail: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
  contactPhone: z.string().regex(PHONE_REG_EXP, { message: "Invalid phone number" }),
});
