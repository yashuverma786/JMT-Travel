import { getDb } from "./getDb" // Assuming getDb is exported from another file

/**
 * Named wrapper used by the API routes that expect `connectToDatabase`.
 * Returns the same MongoDB database instance as `getDb`.
 */
export async function connectToDatabase() {
  return getDb()
}
