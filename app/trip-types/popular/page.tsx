"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, MapPin, Search, Filter, TrendingUp } from "lucide-react"

const popularTrips = [
  {
    id: 1,
    title: "Goa Beach Holiday",
    destination: "Goa",
    image: "/placeholder.svg?height=200&width=300&text=Goa+Beach",
    duration: "4 Days / 3 Nights",
    price: 12999,
    originalPrice: 15999,
    rating: 4.5,
    reviews: 245,
    discount: 19,
    category: "Beach",
    includes: ["Hotel", "Meals", "Transfers"],
  },
  {
    id: 2,
    title: "Kerala Backwaters",
    destination: "Kerala",
    image: "/placeholder.svg?height=200&width=300&text=Kerala+Backwaters",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 17,
    category: "Nature",
    includes: ["Houseboat", "Meals", "Sightseeing"],
  },
  {
    id: 3,
    title: "Rajasthan Royal Tour",
    destination: "Rajasthan",
    image: "/placeholder.svg?height=200&width=300&text=Rajasthan+Royal",
    duration: "6 Days / 5 Nights",
    price: 24999,
    originalPrice: 29999,
    rating: 4.6,
    reviews: 312,
    discount: 17,
    category: "Heritage",
    includes: ["Palace Hotels", "Meals", "Guide"],
  },
  {
    id: 4,
    title: "Himachal Adventure",
    destination: "Himachal Pradesh",
    image: "/placeholder.svg?height=200&width=300&text=Himachal+Adventure",
    duration: "7 Days / 6 Nights",
    price: 21999,
    originalPrice: 26999,
    rating: 4.4,
    reviews: 178,
    discount: 19,
    category: "Adventure",
    includes: ["Hotel", "Adventure", "Meals"],
  },
  {
    id: 5,
    title: "Golden Triangle",
    destination: "Delhi-Agra-Jaipur",
    image: "/placeholder.svg?height=200&width=300&text=Golden+Triangle",
    duration: "5 Days / 4 Nights",
    price: 16999,
    originalPrice: 19999,
    rating: 4.5,
    reviews: 210,
    discount: 15,
    category: "Cultural",
    includes: ["Hotels", "Transport", "Guide"],
  },
  {
    id: 6,
    title: "Kashmir Paradise",
    destination: "Kashmir",
    image: "/placeholder.svg?height=200&width=300&text=Kashmir+Paradise",
    duration: "6 Days / 5 Nights",
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 156,
    discount: 17,
    category: "Hill Station",
    includes: ["Houseboat", "Hotels", "Shikara"],
  },
]

export default function PopularTripsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredTrips = popularTrips
    .filter(
      (trip) =>
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((trip) => filterCategory === "all" || trip.category.toLowerCase() === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return b.reviews - a.reviews
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">Most Popular Trips</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover our most loved and highly-rated travel packages chosen by thousands of happy travelers
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="heritage">Heritage</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="hill station">Hill Station</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="relative">
                  <Image
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {trip.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">{trip.discount}% OFF</Badge>
                  )}
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white">{trip.category}</Badge>
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
                        <span className="font-medium">{trip.rating}</span>
                        <span className="text-gray-500">({trip.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trip.includes.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">₹{trip.price.toLocaleString()}</span>
                          {trip.originalPrice > trip.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                        <Link href={`/holidays/${trip.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No trips found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
