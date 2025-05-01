import { PrismaClient } from "../generated/prisma";
const createPrismaClient = () => new PrismaClient();

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
