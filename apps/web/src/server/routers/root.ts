import { t } from "../instance";
import { auth } from "./auth";
import { user } from "./user";

export const appRouter = t.router({
  auth,
  user
});

export type AppRouter = typeof appRouter;
