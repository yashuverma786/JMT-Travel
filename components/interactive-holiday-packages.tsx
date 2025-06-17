"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Heart, Share2, ArrowRight } from "lucide-react"

const packages = [
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
    description: "Relax on pristine beaches with water sports and nightlife",
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
    description: "Cruise through serene backwaters and lush landscapes",
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
    description: "Experience royal palaces and rich cultural heritage",
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
    description: "Thrilling mountain adventures and scenic landscapes",
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
    description: "Explore India's most iconic historical monuments",
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
    description: "Discover the breathtaking beauty of paradise on earth",
  },
]

export default function InteractiveHolidayPackages() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [likedPackages, setLikedPackages] = useState<Set<number>>(new Set())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  const toggleLike = (packageId: number) => {
    setLikedPackages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(packageId)) {
        newSet.delete(packageId)
      } else {
        newSet.add(packageId)
      }
      return newSet
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Parallax background elements - only render on client */}
      {isClient && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-xl"></div>
        </div>
      )}

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Holiday Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Handpicked packages for your perfect vacation. Discover incredible destinations with our curated travel
            experiences.
          </p>

          {/* Center Gradient Button */}
          <div className="mb-12">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/holidays" className="flex items-center gap-2">
                Explore All Packages
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer relative"
            >
              {/* Floating particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                  className="absolute top-8 right-8 w-1 h-1 bg-orange-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="relative overflow-hidden">
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.title}
                  width={350}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {pkg.discount > 0 && (
                    <Badge className="bg-red-500 text-white animate-pulse">{pkg.discount}% OFF</Badge>
                  )}
                  <Badge className="bg-blue-600 text-white">{pkg.category}</Badge>
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleLike(pkg.id)
                    }}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        likedPackages.has(pkg.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Hover info */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-gray-800 font-medium">{pkg.description}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-gray-500">({pkg.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">₹{pkg.price.toLocaleString()}</span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      asChild
                    >
                      <Link href={`/holidays/${pkg.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Can't Find Your Perfect Package?</h3>
            <p className="text-gray-600 mb-6">Let us create a customized itinerary just for you</p>
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/custom-packages">Create Custom Package</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
