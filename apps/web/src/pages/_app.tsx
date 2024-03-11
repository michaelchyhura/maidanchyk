import type { AppProps } from "next/app";
import { Toaster } from "@maidanchyk/ui";
import { trpc } from "../server/trpc";

import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default trpc.withTRPC(App);
