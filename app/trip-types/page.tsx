"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Mountain, Waves, Building, TreePine, Heart, Users, Camera, Compass } from "lucide-react"

interface TripType {
  _id: string
  name: string
  description: string
  iconUrl: string
  createdAt: string
  updatedAt: string
}

const getIconForTripType = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("adventure") || lowerName.includes("trek")) return <Mountain className="h-8 w-8" />
  if (lowerName.includes("beach") || lowerName.includes("coastal")) return <Waves className="h-8 w-8" />
  if (lowerName.includes("heritage") || lowerName.includes("cultural")) return <Building className="h-8 w-8" />
  if (lowerName.includes("nature") || lowerName.includes("wildlife")) return <TreePine className="h-8 w-8" />
  if (lowerName.includes("honeymoon") || lowerName.includes("romantic")) return <Heart className="h-8 w-8" />
  if (lowerName.includes("family") || lowerName.includes("group")) return <Users className="h-8 w-8" />
  if (lowerName.includes("photography") || lowerName.includes("photo")) return <Camera className="h-8 w-8" />
  return <Compass className="h-8 w-8" />
}

export default function TripTypesPage() {
  const [tripTypes, setTripTypes] = useState<TripType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
      } else {
        console.error("Failed to fetch trip types")
      }
    } catch (error) {
      console.error("Error fetching trip types:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTripTypes = tripTypes.filter(
    (tripType) =>
      tripType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tripType.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Trip Types</h1>
            <p className="text-lg md:text-xl">Choose your perfect adventure style</p>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            <span className="text-lg">Loading trip types...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Compass className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Trip Types</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Choose your perfect adventure style from our diverse range of travel experiences
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">{tripTypes.length} Trip Types</Badge>
            <Badge className="bg-white/20 text-white border-white/30">All Skill Levels</Badge>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trip types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {filteredTripTypes.length === tripTypes.length
              ? `${tripTypes.length} trip types available`
              : `Showing ${filteredTripTypes.length} of ${tripTypes.length} trip types`}
          </p>
        </div>

        {/* Trip Types Grid */}
        {filteredTripTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTripTypes.map((tripType) => (
              <Link key={tripType._id} href={`/trip-types/${tripType.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="mb-4 group-hover:scale-110 transition-transform">
                      {tripType.iconUrl ? (
                        <div className="w-16 h-16 mx-auto mb-2">
                          <Image
                            src={tripType.iconUrl || "/placeholder.svg"}
                            alt={tripType.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                          {getIconForTripType(tripType.name)}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                      {tripType.name}
                    </h3>

                    <p className="text-gray-600 text-sm flex-grow mb-4 line-clamp-3">
                      {tripType.description || `Explore amazing ${tripType.name.toLowerCase()} experiences`}
                    </p>

                    <div className="mt-auto">
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700">
                        Explore {tripType.name}
                      </Button>
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      Added {new Date(tripType.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {tripTypes.length === 0
                ? "No trip types found. Add some trip types from the admin panel!"
                : "No trip types found matching your search criteria"}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              <Button variant="outline" onClick={fetchTripTypes}>
                Refresh Data
              </Button>
            </div>
          </div>
        )}

        {/* Popular Categories */}
        {tripTypes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Trip Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Adventure", icon: <Mountain className="h-6 w-6" />, color: "bg-red-100 text-red-600" },
                { name: "Beach", icon: <Waves className="h-6 w-6" />, color: "bg-blue-100 text-blue-600" },
                { name: "Cultural", icon: <Building className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
                { name: "Nature", icon: <TreePine className="h-6 w-6" />, color: "bg-green-100 text-green-600" },
              ].map((category) => {
                const count = tripTypes.filter((t) => t.name.toLowerCase().includes(category.name.toLowerCase())).length

                return (
                  <Card
                    key={category.name}
                    className="cursor-pointer hover:shadow-lg transition-shadow group"
                    onClick={() => setSearchTerm(category.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                        <div className={`p-3 rounded-full ${category.color}`}>{category.icon}</div>
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{count} types</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find Your Perfect Trip Type?</h2>
          <p className="text-lg mb-6">
            Let us create a custom travel experience tailored to your interests and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/custom-packages">Create Custom Package</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
