import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { t } from "../instance";
import { PHONE_REG_EXP } from "../../shared/lib/regexp";

const update = protectedProcedure
  .input(
    z.object({
      name: z.string().nullish(),
      phone: z.string().regex(PHONE_REG_EXP, { message: "Invalid phone number" }).nullable(),
      telegram: z.string().url({ message: "Invalid URL" }).nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.userId,
      },
      data: input,
    });
  });

export const user = t.router({ update });
