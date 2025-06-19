"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, MapPin, Search, Filter, DollarSign } from "lucide-react"

const budgetTrips = [
  {
    id: 8,
    title: "Rishikesh Yoga Retreat",
    destination: "Rishikesh",
    image: "/placeholder.svg?height=200&width=300&text=Rishikesh+Yoga",
    duration: "4 Days / 3 Nights",
    price: 8999,
    originalPrice: 11999,
    rating: 4.4,
    reviews: 167,
    discount: 25,
    category: "Spiritual",
    includes: ["Ashram", "Yoga", "Meals"],
  },
  {
    id: 9,
    title: "Coorg Coffee Plantation",
    destination: "Coorg",
    image: "/placeholder.svg?height=200&width=300&text=Coorg+Coffee",
    duration: "3 Days / 2 Nights",
    price: 9999,
    originalPrice: 12999,
    rating: 4.3,
    reviews: 198,
    discount: 23,
    category: "Nature",
    includes: ["Homestay", "Meals", "Plantation Tour"],
  },
  {
    id: 11,
    title: "Pushkar Desert Experience",
    destination: "Pushkar",
    image: "/placeholder.svg?height=200&width=300&text=Pushkar+Desert",
    duration: "3 Days / 2 Nights",
    price: 7999,
    originalPrice: 9999,
    rating: 4.2,
    reviews: 145,
    discount: 20,
    category: "Cultural",
    includes: ["Desert Camp", "Camel Safari", "Meals"],
  },
  {
    id: 12,
    title: "Darjeeling Tea Gardens",
    destination: "Darjeeling",
    image: "/placeholder.svg?height=200&width=300&text=Darjeeling+Tea",
    duration: "4 Days / 3 Nights",
    price: 11999,
    originalPrice: 14999,
    rating: 4.5,
    reviews: 223,
    discount: 20,
    category: "Hill Station",
    includes: ["Hotel", "Toy Train", "Tea Garden Tour"],
  },
]

export default function BudgetTripsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-low")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredTrips = budgetTrips
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
          return b.discount - a.discount
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <DollarSign className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">Budget Friendly Trips</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Amazing travel experiences that won't break the bank. Quality trips at unbeatable prices
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
                  placeholder="Search budget trips..."
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
                  <SelectItem value="spiritual">Spiritual</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="hill station">Hill Station</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="discount">Best Discount</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
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
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">{trip.category}</Badge>
                  <Badge className="absolute bottom-2 left-2 bg-teal-500 text-white flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Budget
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-green-600 transition-colors">
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
                          <span className="text-2xl font-bold text-green-600">₹{trip.price.toLocaleString()}</span>
                          {trip.originalPrice > trip.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                      <Button className="bg-teal-500 hover:bg-teal-600" asChild>
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
              <p className="text-gray-500 text-lg">No budget trips found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
