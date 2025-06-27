"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import EnhancedTripCard from "@/components/enhanced-trip-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function FeaturedTripsSection() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips?limit=6")
        if (response.ok) {
          const data = await response.json()
          setTrips(data.trips || [])
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Trips</h2>
            <p className="text-xl text-gray-600">Discover our most popular travel packages</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Trips</h2>
          <p className="text-xl text-gray-600">Discover our most popular travel packages</p>
        </div>

        {trips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {trips.map((trip: any) => (
                <EnhancedTripCard key={trip._id} trip={trip} />
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/trips">
                  View All Trips
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">No trips available at the moment.</p>
            <Button asChild>
              <Link href="/admin/dashboard/trips">Add Your First Trip</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
