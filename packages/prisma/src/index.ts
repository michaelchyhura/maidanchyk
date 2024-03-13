import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

export const prisma = new PrismaClient({
  log: [{ level: "query", emit: "event" }],
});
