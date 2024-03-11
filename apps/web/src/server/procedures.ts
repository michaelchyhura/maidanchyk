import { t } from "./instance";
import { isAuthorized } from "./middlewares/auth";

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthorized);
