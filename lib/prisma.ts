/* Temporary stub for Prisma client.
 *
 * The project’s primary database is MongoDB (see `getDb()` in lib/db.ts).
 * We keep this stub only to satisfy any legacy imports of `prisma`.
 * If you later migrate to Prisma, replace this file with:
 *
 *   import { PrismaClient } from "@prisma/client"
 *   const prisma = new PrismaClient()
 *   export default prisma
 *   export { prisma }
 *
 * …and run `npx prisma generate`.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma: any = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Prisma client is not configured in this project. Remove prisma usages or configure Prisma properly.",
      )
    },
  },
)

export default prisma
export { prisma }
