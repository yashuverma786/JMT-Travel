import { PrismaClient } from "@prisma/client"

/**
 * Singleton Prisma client.
 * In development we attach it to the global object to avoid
 * exhausting database connections with hot-reloads.
 */
const prisma =
  // @ts-ignore
  globalThis.__prisma || new PrismaClient()

// Prevent multiple instances in dev
if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  globalThis.__prisma = prisma
}

export default prisma
export { prisma }
