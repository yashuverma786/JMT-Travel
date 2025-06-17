"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, MapPin, Search } from "lucide-react"

const trips = [
  {
    id: 1,
    title: "Goa Beach Holiday",
    destination: "Goa",
    image: "/placeholder.svg?height=250&width=350",
    duration: "4 Days / 3 Nights",
    price: 12999,
    originalPrice: 15999,
    rating: 4.5,
    reviews: 245,
    discount: 19,
    category: "Beach",
  },
  {
    id: 2,
    title: "Kerala Backwaters",
    destination: "Kerala",
    image: "/placeholder.svg?height=250&width=350",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 17,
    category: "Nature",
  },
  {
    id: 3,
    title: "Rajasthan Royal Tour",
    destination: "Rajasthan",
    image: "/placeholder.svg?height=250&width=350",
    duration: "6 Days / 5 Nights",
    price: 24999,
    originalPrice: 29999,
    rating: 4.6,
    reviews: 312,
    discount: 17,
    category: "Heritage",
  },
  {
    id: 4,
    title: "Himachal Adventure",
    destination: "Himachal Pradesh",
    image: "/placeholder.svg?height=250&width=350",
    duration: "7 Days / 6 Nights",
    price: 21999,
    originalPrice: 26999,
    rating: 4.4,
    reviews: 178,
    discount: 19,
    category: "Adventure",
  },
  {
    id: 5,
    title: "Golden Triangle",
    destination: "Delhi-Agra-Jaipur",
    image: "/placeholder.svg?height=250&width=350",
    duration: "5 Days / 4 Nights",
    price: 16999,
    originalPrice: 19999,
    rating: 4.5,
    reviews: 210,
    discount: 15,
    category: "Heritage",
  },
  {
    id: 6,
    title: "Kashmir Paradise",
    destination: "Kashmir",
    image: "/placeholder.svg?height=250&width=350",
    duration: "6 Days / 5 Nights",
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 156,
    discount: 17,
    category: "Nature",
  },
]

export default function TripsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || trip.category.toLowerCase() === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && trip.price < 20000) ||
      (priceRange === "medium" && trip.price >= 20000 && trip.price < 30000) ||
      (priceRange === "high" && trip.price >= 30000)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Trips</h1>
          <p className="text-xl opacity-90">Find your perfect getaway from our curated collection of trips</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips or destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under ₹20,000</SelectItem>
                <SelectItem value="medium">₹20,000 - ₹30,000</SelectItem>
                <SelectItem value="high">Above ₹30,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Available Trips ({filteredTrips.length})</h2>
            <p className="text-gray-600">Choose from our handpicked selection of amazing trips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.title}
                    width={350}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {trip.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">{trip.discount}% OFF</Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white">{trip.category}</Badge>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{trip.rating}</span>
                        <span className="text-gray-500">({trip.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">₹{trip.price.toLocaleString()}</span>
                          {trip.originalPrice > trip.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">per person</span>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                        <Link href={`/trips/${trip.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No trips found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
