"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin } from "lucide-react"

const packages = [
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
    includes: ["Houseboat", "Hotels", "Shikara"],
  },
]

export default function HolidayPackages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={pkg.image || "/placeholder.svg"}
              alt={pkg.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            {pkg.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">{pkg.discount}% OFF</Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{pkg.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{pkg.destination}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{pkg.rating}</span>
                  <span className="text-gray-500">({pkg.reviews})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {pkg.includes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₹{pkg.price.toLocaleString()}</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">per person</span>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href={`/holidays/${pkg.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
