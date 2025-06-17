"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Calendar, ArrowRight, MapPin, Users, Heart, Share2 } from "lucide-react"

// Mock data for featured packages
const featuredPackages = [
  {
    id: 1,
    title: "Enchanting Bali Adventure",
    destination: "Bali, Indonesia",
    image: "/placeholder.svg?height=400&width=600",
    duration: "7 Days / 6 Nights",
    price: 1299,
    originalPrice: 1529,
    rating: 4.8,
    reviews: 245,
    discount: 15,
    startDate: "Jun 15, 2024",
    category: "Adventure",
    highlights: ["Beach Resort", "Cultural Tours", "Water Sports"],
    isPopular: true,
  },
  {
    id: 2,
    title: "Magical Switzerland Tour",
    destination: "Zurich, Switzerland",
    image: "/placeholder.svg?height=400&width=600",
    duration: "8 Days / 7 Nights",
    price: 2499,
    originalPrice: 2777,
    rating: 4.9,
    reviews: 189,
    discount: 10,
    startDate: "Jul 10, 2024",
    category: "Luxury",
    highlights: ["Mountain Views", "Luxury Hotels", "Scenic Trains"],
    isPopular: false,
  },
  {
    id: 3,
    title: "Serene Maldives Getaway",
    destination: "Malé, Maldives",
    image: "/placeholder.svg?height=400&width=600",
    duration: "5 Days / 4 Nights",
    price: 1899,
    originalPrice: 2374,
    rating: 4.7,
    reviews: 312,
    discount: 20,
    startDate: "Aug 5, 2024",
    category: "Honeymoon",
    highlights: ["Overwater Villa", "Spa Treatments", "Private Dining"],
    isPopular: true,
  },
  {
    id: 4,
    title: "Historic Rome Expedition",
    destination: "Rome, Italy",
    image: "/placeholder.svg?height=400&width=600",
    duration: "6 Days / 5 Nights",
    price: 1599,
    originalPrice: 1817,
    rating: 4.6,
    reviews: 178,
    discount: 12,
    startDate: "Sep 20, 2024",
    category: "Cultural",
    highlights: ["Ancient Sites", "Art Museums", "Local Cuisine"],
    isPopular: false,
  },
  {
    id: 5,
    title: "Amazing Thailand Experience",
    destination: "Bangkok, Thailand",
    image: "/placeholder.svg?height=400&width=600",
    duration: "9 Days / 8 Nights",
    price: 1399,
    originalPrice: 1521,
    rating: 4.5,
    reviews: 210,
    discount: 8,
    startDate: "Oct 15, 2024",
    category: "Adventure",
    highlights: ["Temple Tours", "Street Food", "Island Hopping"],
    isPopular: false,
  },
  {
    id: 6,
    title: "Vibrant Vietnam Tour",
    destination: "Hanoi, Vietnam",
    image: "/placeholder.svg?height=400&width=600",
    duration: "10 Days / 9 Nights",
    price: 1699,
    originalPrice: 1788,
    rating: 4.7,
    reviews: 156,
    discount: 5,
    startDate: "Nov 5, 2024",
    category: "Cultural",
    highlights: ["Ha Long Bay", "Local Markets", "Cooking Classes"],
    isPopular: false,
  },
  {
    id: 7,
    title: "Exotic Egypt Adventure",
    destination: "Cairo, Egypt",
    image: "/placeholder.svg?height=400&width=600",
    duration: "8 Days / 7 Nights",
    price: 1899,
    originalPrice: 1899,
    rating: 4.8,
    reviews: 189,
    discount: 0,
    startDate: "Dec 10, 2024",
    category: "Historical",
    highlights: ["Pyramids", "Nile Cruise", "Desert Safari"],
    isPopular: true,
  },
  {
    id: 8,
    title: "Majestic Morocco Journey",
    destination: "Marrakech, Morocco",
    image: "/placeholder.svg?height=400&width=600",
    duration: "7 Days / 6 Nights",
    price: 1499,
    originalPrice: 1665,
    rating: 4.6,
    reviews: 142,
    discount: 10,
    startDate: "Jan 15, 2025",
    category: "Adventure",
    highlights: ["Sahara Desert", "Medina Tours", "Atlas Mountains"],
    isPopular: false,
  },
]

const categoryColors = {
  Adventure: "bg-gradient-to-r from-[#ea4335] to-[#f7931e]",
  Luxury: "bg-gradient-to-r from-[#0f6d49] to-[#261f25]",
  Honeymoon: "bg-gradient-to-r from-[#f7931e] to-[#ea4335]",
  Cultural: "bg-gradient-to-r from-[#261f25] to-[#0f6d49]",
  Historical: "bg-gradient-to-r from-[#0f6d49] to-[#ea4335]",
}

export default function FeaturedPackages() {
  const [visible, setVisible] = useState<boolean[]>(Array(8).fill(false))
  const [likedPackages, setLikedPackages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      featuredPackages.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, index * 150)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [])

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
    <div className="relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-[#ea4335]/20 to-[#f7931e]/20 rounded-full blur-xl"></div>
        <div className="floating-element-reverse absolute top-32 right-20 w-16 h-16 bg-gradient-to-r from-[#0f6d49]/20 to-[#261f25]/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-[#f7931e]/30 to-[#ea4335]/30 rounded-full blur-lg"></div>
        <div className="floating-element-reverse absolute top-1/2 right-10 w-24 h-24 bg-gradient-to-r from-[#261f25]/15 to-[#0f6d49]/15 rounded-full blur-2xl"></div>
      </div>

      {/* Responsive Trip Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
        {featuredPackages.slice(0, 8).map((pkg, index) => (
          <Card
            key={pkg.id}
            className={`group overflow-hidden transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 border-0 bg-white rounded-2xl h-full flex flex-col ${
              visible[index] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 16px 64px rgba(0, 0, 0, 0.08)",
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative overflow-hidden">
              {/* Maintain aspect ratio for image */}
              <div className="aspect-[4/3] relative">
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Badges and Actions */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {pkg.isPopular && (
                  <Badge className="bg-gradient-to-r from-[#ea4335] to-[#f7931e] text-white border-0 shadow-lg text-xs">
                    🔥 Popular
                  </Badge>
                )}
                {pkg.discount > 0 && (
                  <Badge className="bg-gradient-to-r from-[#0f6d49] to-[#261f25] text-white border-0 shadow-lg text-xs">
                    {pkg.discount}% OFF
                  </Badge>
                )}
                <Badge
                  className={`${categoryColors[pkg.category as keyof typeof categoryColors]} text-white border-0 shadow-lg text-xs`}
                >
                  {pkg.category}
                </Badge>
              </div>

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={() => toggleLike(pkg.id)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                      likedPackages.has(pkg.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white hover:scale-110">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </button>
              </div>

              {/* Hover overlay with highlights */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex flex-wrap gap-1">
                  {pkg.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-800 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                    <span className="ml-1 font-semibold text-xs sm:text-sm">{pkg.rating}</span>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">({pkg.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">2-8</span>
                </div>
              </div>

              {/* Title and Location */}
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2 group-hover:text-[#f7931e] transition-colors leading-tight">
                  {pkg.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">{pkg.destination}</span>
                </div>
              </div>

              {/* Duration and Date */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{pkg.startDate}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {pkg.discount > 0 && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                    )}
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">${pkg.price}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">per person</span>
                </div>
                {pkg.discount > 0 && (
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-medium text-green-600">
                      Save ${pkg.originalPrice - pkg.price}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 sm:p-6 pt-0">
              <div className="w-full space-y-2 sm:space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#ea4335] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ea4335] text-white border-0 h-10 sm:h-12 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg group text-sm sm:text-base"
                >
                  <Link href={`/trips/${pkg.id}`}>
                    <span className="flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 hover:border-[#f7931e] hover:text-[#f7931e] transition-colors h-8 sm:h-10 rounded-lg text-xs sm:text-sm"
                  >
                    Quick Book
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 hover:border-[#f7931e] hover:text-[#f7931e] transition-colors h-8 sm:h-10 rounded-lg text-xs sm:text-sm"
                  >
                    Customize
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
