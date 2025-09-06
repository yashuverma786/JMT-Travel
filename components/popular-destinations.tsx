"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2 } from "lucide-react"

interface Destination {
  _id: string
  name: string
  country: string
  description: string
  imageUrl: string
  popular: boolean
  trending: boolean
}

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations")
      if (response.ok) {
        const data = await response.json()
        // Filter for popular destinations and limit to 6
        const popularDestinations = data.destinations.filter((dest: Destination) => dest.popular).slice(0, 6)
        setDestinations(popularDestinations)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most loved travel destinations chosen by thousands of travelers
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="text-lg">Loading destinations...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most loved travel destinations chosen by thousands of travelers
          </p>
        </div>

        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card key={destination._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.imageUrl || "/placeholder.svg?height=300&width=400"}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=400"
                    }}
                  />
                  {destination.trending && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">Trending</Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {destination.description || "Explore this amazing destination"}
                  </p>
                  <Link
                    href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Explore Packages →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No popular destinations found.</p>
            <p className="text-sm text-gray-400">
              Add some destinations from the admin panel and mark them as popular!
            </p>
          </div>
        )}

        {destinations.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Destinations
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
