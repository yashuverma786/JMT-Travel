"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, Star, Clock } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: string
  imageUrls: string[]
  price: number
  salePrice?: number
  durationDays: number
  durationNights: number
  rating?: number
  activities?: string[]
  category?: string
}

export default function FeaturedTripsSection() {
  const [trips, setTrips] = useState<Trip[]>([])
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

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Trips</h2>
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
    <section className="py-16 bg-gray-50">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Trips</h2>
          <p className="text-xl text-gray-600">Discover our most popular travel packages</p>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => {
              const displayPrice = trip.salePrice && trip.salePrice < trip.price ? trip.salePrice : trip.price
              const hasDiscount = trip.salePrice && trip.salePrice < trip.price
              const discountPercent = hasDiscount ? calculateDiscount(trip.price, trip.salePrice!) : 0

              return (
                <Card key={trip._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <Image
                      src={trip.imageUrls?.[0] || "/placeholder.svg?height=250&width=400&text=Beautiful+Destination"}
                      alt={trip.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white font-semibold">
                        {discountPercent}% OFF
                      </Badge>
                    )}
                    {trip.category && (
                      <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{trip.category}</Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{trip.title}</h3>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{trip.destination}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {trip.durationDays} Days / {trip.durationNights} Nights
                      </span>
                    </div>

                    {trip.activities && trip.activities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Activities:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.activities.slice(0, 2).map((activity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                          {trip.activities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{trip.activities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {trip.rating && (
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{trip.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">(Reviews)</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-green-600">₹{displayPrice.toLocaleString()}</span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{trip.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href={`/trips/${trip._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips available</h3>
                <p className="text-gray-500">Check back soon for exciting travel packages!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
