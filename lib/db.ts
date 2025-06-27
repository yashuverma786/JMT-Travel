import { MongoClient } from "mongodb"
import prismaInstance from "./prisma"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const uri = process.env.MONGODB_URI
let client: MongoClient | null = null

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri as string)
    await client.connect()
  }
  return client.db("jmt_travel")
}

export const prisma = prismaInstance

// Alias needed by a few legacy imports
export async function connectToDatabase() {
  return getDb()
}
