import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/root";
import { createContext } from "../../../server/context";

export default createNextApiHandler({
  router: appRouter,
  createContext: ({ req, res }) => createContext({ req, res }),
  onError({ error }) {
    console.error(error);
  },
});
