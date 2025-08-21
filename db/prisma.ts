// FILE: db/prisma.ts

import { PrismaClient } from "@prisma/client";

// This is the standard Prisma singleton pattern to prevent multiple instances in development.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
