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
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum([UserRole.PLAYER, UserRole.COURT_OWNER]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workos = new WorkOS(process.env.WORKOS_API_KEY);
      const session = await getSession(ctx.req, ctx.res);

      const workosUser = await workos.userManagement.createUser({
        email: input.email,
        password: input.password,
        emailVerified: true,
      });

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          emailVerified: true,
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
