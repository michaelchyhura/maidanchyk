import { string, z } from "zod";
import WorkOS from "@workos-inc/node";
import { UserRole } from "@maidanchyk/prisma";
import { protectedProcedure, publicProcedure } from "../procedures";
import { t } from "../instance";
import { getSession } from "../../shared/lib/session";

export const auth = t.router({
  signUp: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string().regex(new RegExp("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$")),
        password: z.string().min(6),
        role: z.enum([UserRole.CLIENT, UserRole.BUSINESS]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workos = new WorkOS(process.env.WORKOS_API_KEY);
      const session = await getSession(ctx.req, ctx.res);

      const workosUser = await workos.userManagement.createUser({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        emailVerified: true,
      });

      const user = await ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          givenName: `${input.firstName} ${input.lastName}`,
          email: input.email,
          emailVerified: true,
          phone: input.phone,
          workosId: workosUser.id,
          role: input.role,
        },
        select: {
          id: true,
        },
      });

      session.isAuthenticated = true;
      session.userId = user.id;
      session.createdAt = new Date().toISOString();

      await session.save();

      return user;
    }),
  signIn: publicProcedure
    .input(
      z.object({
        email: string().email(),
        password: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workos = new WorkOS(process.env.WORKOS_API_KEY);
      const session = await getSession(ctx.req, ctx.res);

      const { user: workosUser } = await workos.userManagement.authenticateWithPassword({
        email: input.email,
        password: input.password,
        clientId: process.env.WORKOS_CLIENT_ID!,
      });

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          workosId: workosUser.id,
        },
        select: {
          id: true,
        },
      });

      session.isAuthenticated = true;
      session.userId = user.id;
      session.createdAt = new Date().toISOString();

      await session.save();

      return user;
    }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
  }),
});
