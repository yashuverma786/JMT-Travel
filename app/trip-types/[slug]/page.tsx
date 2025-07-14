"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TripCard from "@/components/trip-card"
import type { Trip } from "@/components/trip-card"

interface TripType {
  _id: string
  name: string
  description: string
  iconUrl: string
}

export default function TripTypePage() {
  const params = useParams()
  const { slug } = params

  const [tripType, setTripType] = useState<TripType | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchTripTypeData = async () => {
      try {
        setLoading(true)
        // Fetch all trip types to find the current one by slug
        const tripTypesRes = await fetch("/api/trip-types")
        if (!tripTypesRes.ok) throw new Error("Failed to fetch trip types")
        const { tripTypes } = await tripTypesRes.json()
        const currentTripType = tripTypes.find((tt: TripType) => tt.name.toLowerCase().replace(/ /g, "-") === slug)

        if (!currentTripType) {
          notFound()
          return
        }
        setTripType(currentTripType)

        // Fetch trips for this category
        const tripsRes = await fetch(`/api/trips?category=${currentTripType.name}`)
        if (!tripsRes.ok) throw new Error("Failed to fetch trips")
        const { trips: fetchedTrips } = await tripsRes.json()
        setTrips(fetchedTrips)
      } catch (error) {
        console.error("Error fetching trip type page data:", error)
        // notFound(); // Can be too aggressive
      } finally {
        setLoading(false)
      }
    }

    fetchTripTypeData()
  }, [slug])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!tripType) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 overflow-hidden">
        <Image
          src={tripType.iconUrl || "/placeholder.svg?height=400&width=800&query=travel"}
          alt={tripType.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{tripType.name}</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl">{tripType.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/trips" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to All Trips
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {tripType.name} Packages ({trips.length})
          </h2>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No trips found for the "{tripType.name}" category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
