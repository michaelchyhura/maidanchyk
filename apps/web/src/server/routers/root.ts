import { t } from "../instance";
import { auth } from "./auth";
import { courts } from "./courts";
import { user } from "./user";

export const appRouter = t.router({
  auth,
  user,
  courts
});

export type AppRouter = typeof appRouter;
