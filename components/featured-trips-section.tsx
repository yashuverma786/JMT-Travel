"use client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart } from "lucide-react"

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

export default function FeaturedTripsSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Featured Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <Link href="#">
                <div className="relative">
                  <Image
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="uppercase">{trip.category}</Badge>
                  </div>
                  {trip.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-emerald-500 text-white">-{trip.discount}%</Badge>
                  )}
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors duration-300">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{trip.title}</h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{trip.rating}</span>
                      <span className="text-gray-500 text-xs ml-1">({trip.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      {trip.originalPrice && (
                        <span className="text-gray-500 line-through mr-2">₹{trip.originalPrice}</span>
                      )}
                      <span className="text-xl font-semibold text-emerald-600">₹{trip.price}</span>
                    </div>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
