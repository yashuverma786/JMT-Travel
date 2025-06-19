"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart, Share2, Users } from "lucide-react"
import { motion } from "framer-motion"

const featuredTrips = [
  {
    id: 1,
    title: "Goa Beach Paradise",
    destination: "Goa, India",
    image: "/placeholder.svg?height=300&width=400&text=Goa+Beach",
    duration: "4 Days / 3 Nights",
    price: 12999,
    originalPrice: 15999,
    rating: 4.5,
    reviews: 245,
    discount: 19,
    category: "Beach",
    groupSize: "2-8 People",
    includes: ["Hotel", "Meals", "Transfers", "Activities"],
    highlights: ["Beach Activities", "Water Sports", "Local Cuisine", "Sunset Views"],
    isWishlisted: false,
  },
  {
    id: 2,
    title: "Kerala Backwater Cruise",
    destination: "Kerala, India",
    image: "/placeholder.svg?height=300&width=400&text=Kerala+Backwaters",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 17,
    category: "Nature",
    groupSize: "2-6 People",
    includes: ["Houseboat", "Meals", "Sightseeing", "Guide"],
    highlights: ["Houseboat Stay", "Backwater Cruise", "Spice Gardens", "Ayurveda"],
    isWishlisted: false,
  },
  {
    id: 3,
    title: "Rajasthan Royal Heritage",
    destination: "Rajasthan, India",
    image: "/placeholder.svg?height=300&width=400&text=Rajasthan+Palace",
    duration: "6 Days / 5 Nights",
    price: 24999,
    originalPrice: 29999,
    rating: 4.6,
    reviews: 312,
    discount: 17,
    category: "Heritage",
    groupSize: "2-10 People",
    includes: ["Palace Hotels", "Meals", "Guide", "Transport"],
    highlights: ["Palace Stay", "Camel Safari", "Folk Dance", "Local Markets"],
    isWishlisted: false,
  },
  {
    id: 4,
    title: "Himachal Mountain Adventure",
    destination: "Himachal Pradesh, India",
    image: "/placeholder.svg?height=300&width=400&text=Himachal+Mountains",
    duration: "7 Days / 6 Nights",
    price: 21999,
    originalPrice: 26999,
    rating: 4.4,
    reviews: 178,
    discount: 19,
    category: "Adventure",
    groupSize: "4-12 People",
    includes: ["Hotel", "Adventure Activities", "Meals", "Equipment"],
    highlights: ["Trekking", "River Rafting", "Paragliding", "Mountain Views"],
    isWishlisted: false,
  },
  {
    id: 5,
    title: "Golden Triangle Classic",
    destination: "Delhi-Agra-Jaipur, India",
    image: "/placeholder.svg?height=300&width=400&text=Golden+Triangle",
    duration: "5 Days / 4 Nights",
    price: 16999,
    originalPrice: 19999,
    rating: 4.5,
    reviews: 210,
    discount: 15,
    category: "Cultural",
    groupSize: "2-8 People",
    includes: ["Hotels", "Transport", "Guide", "Monuments"],
    highlights: ["Taj Mahal", "Red Fort", "Hawa Mahal", "Local Culture"],
    isWishlisted: false,
  },
  {
    id: 6,
    title: "Kashmir Valley Beauty",
    destination: "Kashmir, India",
    image: "/placeholder.svg?height=300&width=400&text=Kashmir+Valley",
    duration: "6 Days / 5 Nights",
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 156,
    discount: 17,
    category: "Hill Station",
    groupSize: "2-6 People",
    includes: ["Houseboat", "Hotels", "Shikara", "Meals"],
    highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Saffron Fields"],
    isWishlisted: false,
  },
]

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
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-blue-600">Trip Packages</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of amazing trips with complete details, wishlist, and sharing options
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group h-full">
                <div className="relative">
                  <Image
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {trip.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white font-semibold">
                      {trip.discount}% OFF
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-blue-500 text-white">{trip.category}</Badge>

                  {/* Wishlist and Share buttons */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white p-2 h-8 w-8"
                      onClick={() => toggleWishlist(trip.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${wishlist.includes(trip.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white p-2 h-8 w-8"
                      onClick={() => shareTrip(trip)}
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  <div className="space-y-4 flex-grow">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{trip.destination}</span>
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

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{trip.groupSize}</span>
                    </div>

                    {/* Trip Highlights */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Trip Highlights:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trip.highlights.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {trip.highlights.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{trip.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Includes */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Includes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trip.includes.map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="pt-4 border-t mt-4">
                    <div className="flex items-center justify-between mb-4">
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
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/holidays/${trip.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600" asChild>
                        <Link href={`/holidays/${trip.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Trips Button */}
        <div className="text-center mt-12">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium">
            <Link href="/holidays">View All Trip Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
