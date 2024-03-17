import { z } from "zod";
import { CourtEventType } from "@maidanchyk/prisma";
import { protectedProcedure } from "../procedures";
import { t } from "../instance";
import { PHONE_REG_EXP } from "../../shared/lib/regexp";

const create = protectedProcedure
  .input(
    z.object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(60, "Name should be less then 60 characters long"),
      description: z
        .string()
        .min(1, "Description is required")
        .max(255, "Description should be less then 255 characters long"),
      price: z.string().min(1, "Price is required"),
      supportedEventTypes: z
        .array(
          z.enum([
            CourtEventType.BASKETBALL,
            CourtEventType.VOLLEYBALL,
            CourtEventType.MINI_FOOTBALL,
            CourtEventType.TENNIS,
            CourtEventType.BADMINTON,
            CourtEventType.HANDBALL,
            CourtEventType.MULTI_SPORT,
          ]),
        )
        .refine((value) => value.some((item) => item), {
          message: "You have to select at least one supported event type",
        }),
      photos: z
        .array(
          z.object({
            pathname: z.string(),
            contentType: z.string(),
            url: z.string(),
          }),
        )
        .refine((value) => value.some((item) => item), {
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
      contactEmail: z
        .string()
        .min(1, { message: "Email is required" })
        .email("Invalid email address"),
      contactPhone: z.string().regex(PHONE_REG_EXP, { message: "Invalid phone number" }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.court.create({
      data: {
        name: input.name,
        description: input.description,
        price: parseFloat(input.price),
        supportedEventTypes: input.supportedEventTypes,
        photos: {
          createMany: {
            data: input.photos,
          },
        },
        city: {
          create: {
            description: input.city.description,
            placeId: input.city.place_id,
            mainText: input.city.structured_formatting.main_text,
            secondaryText: input.city.structured_formatting.secondary_text,
            types: input.city.types,
          },
        },
        lat: input.location.lat,
        lng: input.location.lng,
        contactPerson: input.contactPerson,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        user: {
          connect: {
            id: ctx.session.userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  });

export const courts = t.router({ create });
