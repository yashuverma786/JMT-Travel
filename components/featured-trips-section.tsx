"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"

const featuredTrips = [
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
    isWishlisted: false,
  },
  {
    id: 2,
    title: "Kerala Backwater Cruise",
    destination: "Kerala",
    image: "/placeholder.svg?height=200&width=300&text=Kerala+Backwaters",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 17,
    category: "Nature",
    isWishlisted: false,
  },
  {
    id: 3,
    title: "Rajasthan Royal Heritage",
    destination: "Rajasthan",
    image: "/placeholder.svg?height=200&width=300&text=Rajasthan+Palace",
    duration: "6 Days / 5 Nights",
    price: 24999,
    originalPrice: 29999,
    rating: 4.6,
    reviews: 312,
    discount: 17,
    category: "Heritage",
    isWishlisted: false,
  },
  {
    id: 4,
    title: "Himachal Mountain Adventure",
    destination: "Himachal Pradesh",
    image: "/placeholder.svg?height=200&width=300&text=Himachal+Mountains",
    duration: "7 Days / 6 Nights",
    price: 21999,
    originalPrice: 26999,
    rating: 4.4,
    reviews: 178,
    discount: 19,
    category: "Adventure",
    isWishlisted: false,
  },
  {
    id: 5,
    title: "Golden Triangle Classic",
    destination: "Delhi-Agra-Jaipur",
    image: "/placeholder.svg?height=200&width=300&text=Golden+Triangle",
    duration: "5 Days / 4 Nights",
    price: 16999,
    originalPrice: 19999,
    rating: 4.5,
    reviews: 210,
    discount: 15,
    category: "Cultural",
    isWishlisted: false,
  },
  {
    id: 6,
    title: "Kashmir Valley Beauty",
    destination: "Kashmir",
    image: "/placeholder.svg?height=200&width=300&text=Kashmir+Valley",
    duration: "6 Days / 5 Nights",
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 156,
    discount: 17,
    category: "Hill Station",
    isWishlisted: false,
  },
]

const getCategoryColor = (category: string) => {
  const colors = {
    Beach: "bg-blue-500",
    Nature: "bg-green-500",
    Heritage: "bg-purple-500",
    Adventure: "bg-orange-500",
    Cultural: "bg-pink-500",
    "Hill Station": "bg-teal-500",
  }
  return colors[category as keyof typeof colors] || "bg-gray-500"
}

export default function FeaturedTripsSection() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (tripId: number) => {
    setWishlist((prev) => (prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]))
  }

  const shareTrip = (trip: any) => {
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: `Check out this amazing trip: ${trip.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Featured <span className="text-blue-600">Trip Packages</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Discover our handpicked selection of amazing trips with the best deals
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 rounded-xl">
                {/* Image Section */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {trip.discount > 0 && (
                      <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 text-white font-semibold text-xs px-2 py-1 rounded-md">
                        {trip.discount}% OFF
                      </Badge>
                    )}

                    {/* Category Badge */}
                    <Badge
                      className={`absolute top-3 right-3 ${getCategoryColor(trip.category)} hover:${getCategoryColor(trip.category)} text-white font-medium text-xs px-2 py-1 rounded-md`}
                    >
                      {trip.category}
                    </Badge>

                    {/* Wishlist and Share buttons */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white p-1.5 h-7 w-7 rounded-full shadow-sm"
                        onClick={() => toggleWishlist(trip.id)}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${wishlist.includes(trip.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white p-1.5 h-7 w-7 rounded-full shadow-sm"
                        onClick={() => shareTrip(trip)}
                      >
                        <Share2 className="h-3.5 w-3.5 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-4 sm:p-5">
                  {/* Title */}
                  <h3 className="font-bold text-lg sm:text-xl text-blue-600 mb-2 line-clamp-1">{trip.title}</h3>

                  {/* Location and Duration */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{trip.duration}</span>
                    </div>
                  </div>

                  {/* Rating and Price Row */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{trip.rating}</span>
                      <span className="text-gray-500 text-sm">({trip.reviews})</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">
                          ₹{trip.price.toLocaleString()}
                        </span>
                        {trip.originalPrice > trip.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{trip.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>

                    {/* View Details Button */}
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                      asChild
                    >
                      <Link href={`/holidays/${trip.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Trips and Customize Tour Buttons */}
        <div className="text-center mt-8 sm:mt-12 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium w-full sm:w-auto"
          >
            <Link href="/holidays">View All Trip Packages</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium w-full sm:w-auto"
          >
            <Link href="/customize-tour">Customize Your Tour</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
