import { UserRole } from "@maidanchyk/prisma";
import type { IncomingMessage, ServerResponse } from "http";
import { SessionOptions, getIronSession } from "iron-session";

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
  password: process.env.IRON_SESSION_SECRET as string,
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
