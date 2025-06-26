import type React from "react"
import EnhancedTripCard from "./enhanced-trip-card"

interface Trip {
  _id: string
  title: string
  description: string
  imageUrl: string
  price: number
  duration: string
  location: string
}

interface FeaturedTripsSectionProps {
  trips: Trip[]
}

const FeaturedTripsSection: React.FC<FeaturedTripsSectionProps> = ({ trips }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Featured Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <EnhancedTripCard key={trip._id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedTripsSection
