import type { IncomingMessage, ServerResponse } from "node:http";
import type { UserRole } from "@maidanchyk/prisma";
import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";

export interface SessionData {
  isAuthenticated: boolean;
  userId: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

type RequestType = IncomingMessage | Request;
type ResponseType = Response | ServerResponse;

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_SECRET!,
  cookieName: "_resession",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export const getSession = async (request: RequestType, response: ResponseType) => {
  return getIronSession<SessionData>(request, response, sessionOptions);
};
