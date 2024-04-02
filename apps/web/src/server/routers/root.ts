import { t } from "../instance";
import { auth } from "./auth";
import { courts } from "./courts";
import { newsletter } from "./newsletter";
import { user } from "./user";

export const appRouter = t.router({
  auth,
  user,
  courts,
  newsletter,
});

export type AppRouter = typeof appRouter;
