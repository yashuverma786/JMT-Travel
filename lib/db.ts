import { MongoClient } from "mongodb"
import prismaInstance from "./prisma"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const uri = process.env.MONGODB_URI

// Global caching in dev - avoids creating multiple clients
let client: MongoClient | null = null

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri as string)
    await client.connect()
  }
  // 👇 change the DB name if you use something else
  return client.db("jmt_travel")
}

export const prisma = prismaInstance
