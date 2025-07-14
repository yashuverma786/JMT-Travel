"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Plane, Hotel, Car } from "lucide-react"
import TripCard from "@/components/trip-card"
import type { Trip } from "@/components/trip-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Destination {
  _id: string
  name: string
  country: string
  description: string
  imageUrl: string
  popular: boolean
  trending: boolean
  type?: "national" | "international"
}

export default function CountryPackagesPage() {
  const params = useParams()
  const { country: countrySlug } = params

  const [destination, setDestination] = useState<Destination | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!countrySlug) return

    const fetchDestinationData = async () => {
      try {
        setLoading(true)
        const destinationsRes = await fetch("/api/destinations")
        if (!destinationsRes.ok) throw new Error("Failed to fetch destinations")
        const { destinations } = await destinationsRes.json()

        const currentDestination = destinations.find(
          (d: Destination) => d.name.toLowerCase().replace(/ /g, "-") === countrySlug,
        )

        if (!currentDestination) {
          notFound()
          return
        }
        setDestination(currentDestination)

        const tripsRes = await fetch(`/api/trips?destinationName=${currentDestination.name}`)
        if (!tripsRes.ok) throw new Error("Failed to fetch trips")
        const { trips: fetchedTrips } = await tripsRes.json()
        setTrips(fetchedTrips)
      } catch (error) {
        console.error("Error fetching destination page data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinationData()
  }, [countrySlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Skeleton className="h-96 w-full" />
        <div className="container py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="flex flex-wrap gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!destination) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 overflow-hidden">
        <Image
          src={destination.imageUrl || "/placeholder.svg?height=400&width=800"}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl">{destination.description}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trips.length} Packages Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Packages in {destination.name}</h2>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No packages found for {destination.name}.</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Plane className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flight Bookings</h3>
              <p className="text-sm text-gray-600">We can arrange flights to {destination.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Hotel className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Accommodation</h3>
              <p className="text-sm text-gray-600">From budget to luxury hotels</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transportation</h3>
              <p className="text-sm text-gray-600">Private cabs and transfers included</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
