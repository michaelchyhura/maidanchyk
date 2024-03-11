import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";
import { getSession } from "../lib/session";

export function authMiddleware(middleware: CustomMiddleware) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const session = await getSession(req, NextResponse.next());
    const pathname = req.nextUrl.pathname;
    const isAuthRoute = pathname.startsWith("/auth");

    if (session.isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!session.isAuthenticated && !isAuthRoute) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    return middleware(req, event, NextResponse.next());
  };
}
