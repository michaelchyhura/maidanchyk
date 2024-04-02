import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";
import { getSession } from "../lib/session";
import { UserRole } from "@maidanchyk/prisma";

const routes = {
  public: ["/auth/sign-in", "/auth/sign-up"],
  protected: ["/settings"],
  courtOwner: ["/courts/create", "/courts/edit", "/courts/mine"],
  // player: [],
  verify: ["/auth/verify"],
};

export function authMiddleware(middleware: CustomMiddleware) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const session = await getSession(req, NextResponse.next());
    const pathname = req.nextUrl.pathname;
    const isPublicRoute = routes.public.includes(pathname);
    const isProtectedRoute = routes.protected.includes(pathname);
    const isVerifyRoute = routes.verify.includes(pathname);
    const isCourtOwnerRoute = routes.courtOwner.includes(pathname);

    if (isPublicRoute && session.isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!isVerifyRoute && session.isAuthenticated && !session.emailVerified) {
      return NextResponse.redirect(new URL("/auth/verify", req.url));
    }

    if (isVerifyRoute && (!session.isAuthenticated || session.emailVerified)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isProtectedRoute && !session.isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    if (isCourtOwnerRoute && session.role !== UserRole.COURT_OWNER) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return middleware(req, event, NextResponse.next());
  };
}
