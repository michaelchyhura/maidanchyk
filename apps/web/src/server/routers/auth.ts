import { z } from "zod";
import WorkOS from "@workos-inc/node";
import { UserRole } from "@maidanchyk/prisma";
import { protectedProcedure, publicProcedure } from "../procedures";
import { t } from "../instance";
import { getSession } from "../../shared/lib/session";
import { getAppUrl } from "../../shared/lib/urls";

const signUp = publicProcedure
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
  });

const signIn = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
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
  });

const signOut = protectedProcedure.mutation(async ({ ctx }) => {
  ctx.session.destroy();
});

const me = protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      phone: true,
      telegram: true,
      role: true,
    },
  });

  return user;
});

const forgotPassword = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ input }) => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY);

    await workos.userManagement.sendPasswordResetEmail({
      email: input.email,
      passwordResetUrl: getAppUrl("/auth/reset-password"),
    });
  });

const resetPassword = publicProcedure
  .input(
    z.object({
      token: z.string(),
      password: z.string().min(6),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY);
    const session = await getSession(ctx.req, ctx.res);

    const { user: workosUser } = await workos.userManagement.resetPassword({
      token: input.token,
      newPassword: input.password,
    });

    await workos.userManagement.authenticateWithPassword({
      email: workosUser.email,
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
  });

export const auth = t.router({ signUp, signIn, signOut, me, forgotPassword, resetPassword });
