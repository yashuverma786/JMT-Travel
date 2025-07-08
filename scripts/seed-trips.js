const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jmt-travel"

const sampleTrips = [
  {
    title: "Romantic Goa Honeymoon Package",
    destinationId: null, // Will be set dynamically
    tripType: "Honeymoon",
    status: "active",
    durationDays: 5,
    durationNights: 4,
    minPax: 2,
    maxPax: 2,
    adultPrice: 35000,
    salePrice: 28000,
    childPrice: 0,
    description:
      "Experience the perfect romantic getaway in Goa with pristine beaches, luxury resorts, and unforgettable moments.",
    highlights: ["Private beach dinner", "Couple spa session", "Sunset cruise", "Luxury resort stay"],
    inclusions: [
      "4 nights accommodation in luxury resort",
      "Daily breakfast and dinner",
      "Airport transfers",
      "Couple spa session",
      "Private beach dinner",
      "Sunset cruise",
    ],
    exclusions: ["Airfare", "Personal expenses", "Lunch", "Adventure activities"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa",
        description: "Arrive at Goa airport, transfer to resort, check-in and relax. Evening at leisure on the beach.",
      },
      {
        day: 2,
        title: "North Goa Sightseeing",
        description:
          "Visit famous beaches like Baga, Calangute, and Anjuna. Explore local markets and enjoy water sports.",
      },
      {
        day: 3,
        title: "Romantic Day",
        description: "Couple spa session in the morning. Private beach dinner in the evening with sunset cruise.",
      },
      {
        day: 4,
        title: "South Goa Exploration",
        description: "Visit peaceful beaches of South Goa, explore old churches and enjoy local cuisine.",
      },
      {
        day: 5,
        title: "Departure",
        description: "Check-out from resort and transfer to airport for departure.",
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop",
    ],
    isTrending: true,
    difficulty: "easy",
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Manali Adventure Trek Package",
    destinationId: null,
    tripType: "Adventure",
    status: "active",
    durationDays: 7,
    durationNights: 6,
    minPax: 4,
    maxPax: 12,
    adultPrice: 25000,
    salePrice: 20000,
    childPrice: 15000,
    description:
      "Embark on an thrilling adventure in the mountains of Manali with trekking, camping, and breathtaking views.",
    highlights: ["Himalayan trekking", "Camping under stars", "River rafting", "Mountain biking"],
    inclusions: [
      "6 nights accommodation (3 hotel + 3 camping)",
      "All meals during trek",
      "Professional trek guide",
      "Trekking equipment",
      "Transportation",
      "First aid kit",
    ],
    exclusions: ["Personal trekking gear", "Insurance", "Tips to guide", "Emergency evacuation"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        description: "Arrive in Manali, check-in to hotel, acclimatization and briefing session.",
      },
      {
        day: 2,
        title: "Local Sightseeing",
        description: "Visit Hadimba Temple, Vashisht Hot Springs, and local markets. Gear check and preparation.",
      },
      {
        day: 3,
        title: "Trek to Base Camp",
        description: "Start trek to base camp, set up tents, evening campfire and dinner.",
      },
      {
        day: 4,
        title: "Summit Day",
        description: "Early morning summit attempt, return to base camp, celebrate achievement.",
      },
      {
        day: 5,
        title: "River Rafting",
        description: "Descend to valley, river rafting in Beas river, camping by riverside.",
      },
      {
        day: 6,
        title: "Adventure Activities",
        description: "Mountain biking, rock climbing, and other adventure activities.",
      },
      {
        day: 7,
        title: "Departure",
        description: "Return to Manali, check-out and departure.",
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150baec4ba5?w=500&h=300&fit=crop",
    ],
    isTrending: true,
    difficulty: "moderate",
    rating: 4.6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Kerala Backwaters Family Package",
    destinationId: null,
    tripType: "Family",
    status: "active",
    durationDays: 6,
    durationNights: 5,
    minPax: 4,
    maxPax: 8,
    adultPrice: 30000,
    salePrice: 25000,
    childPrice: 18000,
    description:
      "Explore the serene backwaters of Kerala with your family, enjoy houseboat stays and cultural experiences.",
    highlights: ["Houseboat stay", "Backwater cruise", "Spice plantation visit", "Cultural performances"],
    inclusions: [
      "5 nights accommodation (3 hotel + 2 houseboat)",
      "All meals",
      "Backwater cruise",
      "Spice plantation tour",
      "Cultural show tickets",
      "Transportation",
    ],
    exclusions: ["Airfare", "Personal expenses", "Optional activities", "Tips"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi",
        description: "Arrive in Kochi, check-in to hotel, visit Chinese fishing nets and local markets.",
      },
      {
        day: 2,
        title: "Kochi to Munnar",
        description: "Drive to Munnar, check-in to hotel, visit tea gardens and enjoy mountain views.",
      },
      {
        day: 3,
        title: "Munnar Sightseeing",
        description: "Visit Eravikulam National Park, spice plantations, and enjoy nature walks.",
      },
      {
        day: 4,
        title: "Munnar to Alleppey",
        description: "Drive to Alleppey, board houseboat, cruise through backwaters.",
      },
      {
        day: 5,
        title: "Backwater Experience",
        description: "Full day houseboat experience, visit local villages, cultural performances.",
      },
      {
        day: 6,
        title: "Departure",
        description: "Check-out from houseboat, transfer to Kochi airport for departure.",
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop",
    ],
    isTrending: false,
    difficulty: "easy",
    rating: 4.7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Rajasthan Cultural Heritage Tour",
    destinationId: null,
    tripType: "Cultural",
    status: "active",
    durationDays: 8,
    durationNights: 7,
    minPax: 2,
    maxPax: 15,
    adultPrice: 40000,
    salePrice: 35000,
    childPrice: 25000,
    description:
      "Immerse yourself in the rich culture and heritage of Rajasthan with palace visits, desert safari, and traditional experiences.",
    highlights: ["Palace and fort visits", "Desert safari", "Camel ride", "Traditional folk performances"],
    inclusions: [
      "7 nights accommodation in heritage hotels",
      "Daily breakfast and dinner",
      "All sightseeing tours",
      "Desert safari with camel ride",
      "Cultural performances",
      "Transportation",
    ],
    exclusions: ["Airfare", "Lunch", "Personal expenses", "Camera fees at monuments"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jaipur",
        description: "Arrive in Jaipur, check-in to heritage hotel, evening at leisure.",
      },
      {
        day: 2,
        title: "Jaipur Sightseeing",
        description: "Visit Amber Fort, City Palace, Hawa Mahal, and local bazaars.",
      },
      {
        day: 3,
        title: "Jaipur to Jodhpur",
        description: "Drive to Jodhpur, visit Mehrangarh Fort and explore blue city.",
      },
      {
        day: 4,
        title: "Jodhpur to Jaisalmer",
        description: "Drive to Jaisalmer, check-in to hotel, visit Jaisalmer Fort.",
      },
      {
        day: 5,
        title: "Desert Safari",
        description: "Full day desert safari, camel ride, sunset at sand dunes, cultural performances.",
      },
      {
        day: 6,
        title: "Jaisalmer to Udaipur",
        description: "Drive to Udaipur, check-in to lake-facing hotel, evening boat ride.",
      },
      {
        day: 7,
        title: "Udaipur Sightseeing",
        description: "Visit City Palace, Jagdish Temple, Saheliyon ki Bari, and local markets.",
      },
      {
        day: 8,
        title: "Departure",
        description: "Check-out from hotel and transfer to airport for departure.",
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop",
    ],
    isTrending: true,
    difficulty: "easy",
    rating: 4.9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Ladakh Bike Adventure",
    destinationId: null,
    tripType: "Adventure",
    status: "active",
    durationDays: 10,
    durationNights: 9,
    minPax: 6,
    maxPax: 12,
    adultPrice: 55000,
    salePrice: 48000,
    childPrice: 0,
    description:
      "Ultimate motorcycle adventure through the challenging terrains of Ladakh with breathtaking landscapes.",
    highlights: ["Motorcycle expedition", "High altitude passes", "Monastery visits", "Camping under stars"],
    inclusions: [
      "9 nights accommodation (hotels + camps)",
      "Royal Enfield motorcycle",
      "Fuel and maintenance",
      "Professional guide",
      "All meals",
      "Permits and documentation",
    ],
    exclusions: ["Airfare to Leh", "Personal riding gear", "Insurance", "Emergency evacuation"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh",
        description: "Arrive in Leh, acclimatization day, bike allocation and briefing.",
      },
      {
        day: 2,
        title: "Leh Local Sightseeing",
        description: "Visit Shanti Stupa, Leh Palace, local markets, test ride.",
      },
      {
        day: 3,
        title: "Leh to Nubra Valley",
        description: "Ride to Nubra Valley via Khardung La Pass, camel ride at Hunder.",
      },
      {
        day: 4,
        title: "Nubra Valley Exploration",
        description: "Explore Diskit Monastery, sand dunes, and local villages.",
      },
      {
        day: 5,
        title: "Nubra to Pangong Lake",
        description: "Ride to Pangong Lake via Shyok route, camping by the lake.",
      },
      {
        day: 6,
        title: "Pangong Lake",
        description: "Full day at Pangong Lake, photography, relaxation.",
      },
      {
        day: 7,
        title: "Pangong to Leh",
        description: "Return to Leh via Chang La Pass, evening rest.",
      },
      {
        day: 8,
        title: "Leh to Sarchu",
        description: "Ride towards Sarchu, camping in tents.",
      },
      {
        day: 9,
        title: "Sarchu to Manali",
        description: "Complete the circuit by riding to Manali via Rohtang Pass.",
      },
      {
        day: 10,
        title: "Departure",
        description: "Bike return, departure from Manali.",
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150baec4ba5?w=500&h=300&fit=crop",
    ],
    isTrending: true,
    difficulty: "hard",
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedTrips() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get some destinations to link with trips
    const destinations = await db.collection("destinations").find({}).limit(5).toArray()

    if (destinations.length === 0) {
      console.log("No destinations found. Please seed destinations first.")
      return
    }

    // Assign destinations to trips
    const tripsWithDestinations = sampleTrips.map((trip, index) => ({
      ...trip,
      destinationId: destinations[index % destinations.length]._id,
    }))

    // Clear existing trips
    await db.collection("trips").deleteMany({})
    console.log("Cleared existing trips")

    // Insert new trips
    const result = await db.collection("trips").insertMany(tripsWithDestinations)
    console.log(`Inserted ${result.insertedCount} trips`)

    console.log("Trip seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding trips:", error)
  } finally {
    await client.close()
  }
}

seedTrips()
