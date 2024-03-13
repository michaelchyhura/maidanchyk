import type { AppProps } from "next/app";
import { Toaster } from "@maidanchyk/ui";
import { trpc } from "../server/trpc";
import { AuthProvider } from "../shared/providers/auth";

import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider user={pageProps.user}>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default trpc.withTRPC(App);
