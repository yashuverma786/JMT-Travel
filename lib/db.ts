import { MongoClient, type Db } from "mongodb"

/**
 * Lightweight singleton wrapper so
 *  `import { db } from "@/lib/db"`
 * works everywhere without reconnecting.
 */
let cached: { client: MongoClient; db: Db } | null = null

async function connect(): Promise<Db> {
  if (cached) return cached.db

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("Missing MONGODB_URI env variable")

  const client = new MongoClient(uri)
  await client.connect()

  cached = { client, db: client.db() }
  return cached.db
}

/**
 * The codebase expects a _named_ export called **db**
 * (it can be awaited: `const database = await db`)
 */
export const db = connect()
