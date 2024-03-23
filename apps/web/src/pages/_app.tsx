import type { AppProps } from "next/app";
import { Toaster } from "@maidanchyk/ui";
import { trpc } from "../server/trpc";
import { AuthProvider } from "../shared/providers/auth";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import "react-photo-view/dist/react-photo-view.css";

import "../styles/globals.css";

dayjs.extend(LocalizedFormat);

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider user={pageProps.user}>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default trpc.withTRPC(App);
