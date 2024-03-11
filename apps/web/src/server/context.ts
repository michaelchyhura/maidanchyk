import { PrismaClient } from "@maidanchyk/prisma";
import { inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../shared/lib/session";

export const createContext = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const prisma = new PrismaClient();
  const session = await getSession(req, res);

  return { session, prisma, req, res };
};

export type Context = inferAsyncReturnType<typeof createContext>;
