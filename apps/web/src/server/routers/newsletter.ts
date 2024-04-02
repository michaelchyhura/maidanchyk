import { z } from "zod";
import { publicProcedure } from "../procedures";
import { t } from "../instance";

const subscribe = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.newsletterSubscriber.upsert({
      where: {
        email: input.email,
      },
      create: {
        email: input.email,
      },
      update: {},
    });
  });

export const newsletter = t.router({ subscribe });
