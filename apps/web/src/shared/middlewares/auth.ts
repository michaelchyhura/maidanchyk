import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";
import { getSession } from "../lib/session";

const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];
const protectedRoutes = ["/settings"];

export function authMiddleware(middleware: CustomMiddleware) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const session = await getSession(req, NextResponse.next());
    const pathname = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isVerifyRoute = pathname.includes("/auth/verify");

    if (isPublicRoute && session.isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!isVerifyRoute && session.isAuthenticated && !session.emailVerified) {
      return NextResponse.redirect(new URL("/auth/verify", req.url));
    }

    if (isVerifyRoute && session.emailVerified) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isProtectedRoute && !session.isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    return middleware(req, event, NextResponse.next());
  };
}
