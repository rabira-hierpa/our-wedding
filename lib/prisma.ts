import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    // Connection pooling configured via DATABASE_URL with ?connection_limit=20&pool_timeout=20
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
