import { z } from "zod";
import WorkOS, { GenericServerException } from "@workos-inc/node";
import { UserRole } from "@maidanchyk/prisma";
import { protectedProcedure, publicProcedure } from "../procedures";
import { t } from "../instance";
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

    const workosUser = await workos.userManagement.createUser({
      email: input.email,
      password: input.password,
    });

    await workos.userManagement.sendVerificationEmail({ userId: workosUser.id });

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        workosId: workosUser.id,
        role: input.role,
      },
      select: {
        id: true,
        role: true,
      },
    });

    ctx.session.isAuthenticated = true;
    ctx.session.userId = user.id;
    ctx.session.role = user.role;
    ctx.session.emailVerified = workosUser.emailVerified;
    ctx.session.createdAt = new Date().toISOString();

    await ctx.session.save();

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

    try {
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
          role: true,
        },
      });

      ctx.session.isAuthenticated = true;
      ctx.session.userId = user.id;
      ctx.session.role = user.role;
      ctx.session.emailVerified = workosUser.emailVerified;
      ctx.session.createdAt = new Date().toISOString();

      await ctx.session.save();

      return user;
    } catch (error) {
      if (error instanceof GenericServerException) {
        if (error.message === "Email ownership must be verified before authentication.") {
          const user = await ctx.prisma.user.findUniqueOrThrow({
            where: {
              email: input.email,
            },
            select: {
              id: true,
              role: true,
              workosId: true,
            },
          });

          await workos.userManagement.sendVerificationEmail({ userId: user.workosId });

          ctx.session.isAuthenticated = true;
          ctx.session.userId = user.id;
          ctx.session.role = user.role;
          ctx.session.emailVerified = false;
          ctx.session.createdAt = new Date().toISOString();

          await ctx.session.save();

          return user;
        }
      }

      throw error;
    }
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
        role: true,
      },
    });

    ctx.session.isAuthenticated = true;
    ctx.session.userId = user.id;
    ctx.session.role = user.role;
    ctx.session.emailVerified = workosUser.emailVerified;
    ctx.session.createdAt = new Date().toISOString();

    await ctx.session.save();

    return user;
  });

const sendVerificationEmail = protectedProcedure.mutation(async ({ ctx }) => {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const user = await ctx.prisma.user.findUniqueOrThrow({
    where: {
      id: ctx.session.userId,
    },
  });

  await workos.userManagement.sendVerificationEmail({ userId: user.workosId });
});

const verifyEmail = protectedProcedure
  .input(
    z.object({
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY);

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.userId,
      },
    });

    const { user: workosUser } = await workos.userManagement.verifyEmail({
      code: input.code,
      userId: user.workosId,
    });

    await ctx.prisma.user.update({
      where: {
        workosId: workosUser.id,
      },
      data: {
        emailVerified: true,
      },
    });

    ctx.session.emailVerified = true;

    await ctx.session.save();
  });

export const auth = t.router({
  signUp,
  signIn,
  signOut,
  me,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
});
