const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jmt-travel"

const destinations = [
  {
    name: "Goa",
    country: "India",
    description: "Beautiful beaches and vibrant nightlife",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Kerala",
    country: "India",
    description: "Gods own country with backwaters and hill stations",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rajasthan",
    country: "India",
    description: "Land of kings with magnificent palaces and forts",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Himachal Pradesh",
    country: "India",
    description: "Mountain paradise with snow-capped peaks",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maldives",
    country: "Maldives",
    description: "Tropical paradise with crystal clear waters",
    type: "international",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dubai",
    country: "UAE",
    description: "Modern city with luxury shopping and architecture",
    type: "international",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDestinations() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    // Clear existing destinations
    await db.collection("destinations").deleteMany({})

    // Insert new destinations
    const result = await db.collection("destinations").insertMany(destinations)
    console.log(`✅ Inserted ${result.insertedCount} destinations`)

    return result.insertedIds
  } catch (error) {
    console.error("❌ Error seeding destinations:", error)
    throw error
  } finally {
    await client.close()
  }
}

module.exports = { seedDestinations, destinations }

if (require.main === module) {
  seedDestinations()
    .then(() => {
      console.log("🎉 Destinations seeded successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Failed to seed destinations:", error)
      process.exit(1)
    })
}
