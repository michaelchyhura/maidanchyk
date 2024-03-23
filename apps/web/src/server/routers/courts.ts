import { z } from "zod";
import { CourtEvent } from "@maidanchyk/prisma";
import { protectedProcedure, publicProcedure } from "../procedures";
import { t } from "../instance";
import { PHONE_REG_EXP } from "../../shared/lib/regexp";

const list = publicProcedure
  .input(
    z.object({
      page: z.number().nullish(),
      limit: z.number().min(1).max(100).nullish(),
      query: z.string().optional(),
      sort: z
        .object({
          createdAt: z.enum(["asc", "desc"]).optional(),
          price: z.enum(["asc", "desc"]).optional(),
        })
        .optional(),
      city: z.object({ placeId: z.string().optional() }).optional(),
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
        .optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const where = {};
    const page = input.page ? input.page - 1 : 0;
    const limit = input.limit ?? 50;

    if (input.query) {
      Object.assign(where, { name: { mode: "insensitive", contains: input.query } });
    }

    if (input.city?.placeId) {
      Object.assign(where, { city: { placeId: input.city.placeId } });
    }

    if (input.events) {
      Object.assign(where, { events: { hasSome: input.events } });
    }

    const [items, count] = await ctx.prisma.$transaction([
      ctx.prisma.court.findMany({
        take: limit,
        skip: page * limit,
        where,
        orderBy: input.sort || { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          location: {
            select: {
              formattedAddress: true,
            },
          },
          photos: {
            take: 1,
          },
          events: true,
          createdAt: true,
        },
      }),
      ctx.prisma.court.count({ where }),
    ]);

    return {
      items,
      page: input.page,
      totalPages: Math.ceil(count / limit),
      total: count,
    };
  });

const get = publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  return ctx.prisma.court.findUnique({
    where: {
      id: input.id,
    },
    include: {
      location: true,
      photos: true,
    },
  });
});

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
        })
        .refine((value) => value, {
          message: "City is required",
        }),
      location: z
        .object({
          placeId: z.string(),
          formattedAddress: z.string(),
          lat: z.number(),

          lng: z.number(),
        })
        .refine((value) => value, {
          message: "Location is required",
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
        events: input.events,
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
          },
        },
        location: {
          create: input.location,
        },
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

export const courts = t.router({ list, get, create });
