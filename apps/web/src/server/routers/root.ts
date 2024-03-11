import { t } from "../instance";
import { auth } from "./auth";

export const appRouter = t.router({
  auth,
});

export type AppRouter = typeof appRouter;
