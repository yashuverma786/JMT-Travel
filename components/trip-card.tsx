import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star } from "lucide-react"

export interface Trip {
  _id: string
  title: string
  destinationName?: string
  destinationId?: string
  durationDays?: number
  durationNights?: number
  featuredImage?: string
  imageUrls?: string[]
  galleryImages?: string[]
  adultPrice?: number
  salePrice?: number
  normalPrice?: number
  rating?: number
  category?: string
  tripType?: string
  overview?: string
  description?: string
  status?: string
  isTrending?: boolean
}

export default function TripCard({ trip }: { trip: Trip }) {
  // Safe price handling
  const adultPrice = typeof trip.adultPrice === "number" ? trip.adultPrice : 0
  const salePrice = typeof trip.salePrice === "number" ? trip.salePrice : adultPrice
  const normalPrice = typeof trip.normalPrice === "number" ? trip.normalPrice : adultPrice

  const displayPrice = salePrice > 0 ? salePrice : normalPrice > 0 ? normalPrice : adultPrice
  const originalPrice = adultPrice > salePrice ? adultPrice : normalPrice

  const hasDiscount = originalPrice > displayPrice && displayPrice > 0
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0

  // Safe image handling
  const imageUrl =
    trip.featuredImage ||
    (trip.imageUrls && trip.imageUrls[0]) ||
    (trip.galleryImages && trip.galleryImages[0]) ||
    "/diverse-travel-destinations.png"

  // Safe duration handling
  const duration = trip.durationDays || 1
  const nights = trip.durationNights || (duration > 0 ? duration - 1 : 0)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
      <Link href={`/trips/${trip._id}`} className="flex-grow flex flex-col">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={trip.title || "Trip"}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
          )}
          {trip.isTrending && <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>}
          {(trip.category || trip.tripType) && (
            <Badge className="absolute bottom-2 right-2 bg-blue-500 text-white">{trip.category || trip.tripType}</Badge>
          )}
        </div>

        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3 flex-grow">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 h-14">{trip.title || "Untitled Trip"}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                {trip.destinationName && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.destinationName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {duration}D/{nights}N
                  </span>
                </div>
              </div>
            </div>

            {trip.description && <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>}

            <div className="flex items-center justify-between text-sm">
              {typeof trip.rating === "number" && trip.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{trip.rating}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t mt-4">
            <div className="flex items-center justify-between">
              <div>
                {displayPrice > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">₹{displayPrice.toLocaleString("en-IN")}</span>
                    {hasDiscount && originalPrice > displayPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-lg font-bold text-blue-600">Price on request</span>
                )}
                <span className="text-xs text-gray-500">per person</span>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
