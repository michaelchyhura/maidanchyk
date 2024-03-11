import { TRPCError } from "@trpc/server";
import { t } from "../instance";

export const isAuthorized = t.middleware(({ next, ctx }) => {
  if (!ctx.session.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: { userSession: ctx.session },
  });
});
