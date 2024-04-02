import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./routers/root";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * https://trpc.io/docs/ssr
           **/
          url: `/api/trpc`,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * https://trpc.io/docs/ssr
   **/
  ssr: false,
});
