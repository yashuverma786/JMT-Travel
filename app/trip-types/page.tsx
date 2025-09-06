"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

interface TripType {
  _id: string
  name: string
  description: string
  imageUrl: string
  features: string[]
  packageCount?: number
}

export default function TripTypesPage() {
  const [tripTypes, setTripTypes] = useState<TripType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTripTypes()
  }, [])

  const fetchTripTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trip-types")
      if (response.ok) {
        const data = await response.json()
        setTripTypes(data.tripTypes || [])
      }
    } catch (error) {
      console.error("Error fetching trip types:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Trip Type</h1>
            <p className="text-xl opacity-90">Find the perfect trip style that matches your preferences</p>
          </div>
        </section>
        <div className="container py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="text-lg">Loading trip types...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Trip Type</h1>
          <p className="text-xl opacity-90">Find the perfect trip style that matches your preferences</p>
        </div>
      </section>

      {/* Trip Types Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trip Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're planning a romantic honeymoon, family vacation, or adventure trip, we have the perfect
              package for every type of traveler.
            </p>
          </div>

          {tripTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tripTypes.map((type) => (
                <Card
                  key={type._id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={type.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={type.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {type.name}
                        </h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>

                      {type.features && type.features.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Features:</h4>
                          <ul className="space-y-1">
                            {type.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-sm text-gray-500">{type.packageCount || 0} packages available</span>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 group" asChild>
                          <Link href={`/trip-types/${type.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            Explore
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No trip types found.</p>
              <p className="text-sm text-gray-400">Add some trip types from the admin panel!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
