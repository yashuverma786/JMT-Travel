import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star } from "lucide-react"

export interface Trip {
  _id: string
  id?: string
  title: string
  destinationName?: string
  destination?: string
  destinationId?: string
  durationDays?: number
  durationNights?: number
  duration?: string
  featuredImage?: string
  imageUrl?: string
  imageUrls?: string[]
  image?: string
  galleryImages?: string[]
  adultPrice?: number
  salePrice?: number
  normalPrice?: number
  price?: number
  displayPrice?: number
  originalPrice?: number
  hasDiscount?: boolean
  discount?: number
  discountPercentage?: number
  rating?: number
  reviews?: number
  reviewCount?: number
  category?: string
  tripType?: string
  overview?: string
  description?: string
  status?: string
  isTrending?: boolean
  isPopular?: boolean
  slug?: string
}

export default function TripCard({ trip }: { trip: Trip }) {
  // Standardized data extraction
  const tripId = trip._id || trip.id || ""
  const title = trip.title || "Untitled Trip"
  const destination = trip.destinationName || trip.destination || "Unknown Destination"

  // Duration handling
  const durationDays = trip.durationDays || 1
  const durationNights = trip.durationNights || (durationDays > 0 ? durationDays - 1 : 0)
  const duration = trip.duration || `${durationDays}D/${durationNights}N`

  // Image handling - prioritize different image fields
  const imageUrl =
    trip.featuredImage ||
    trip.imageUrl ||
    trip.image ||
    (trip.imageUrls && trip.imageUrls[0]) ||
    (trip.galleryImages && trip.galleryImages[0]) ||
    "/placeholder.svg?height=250&width=400&text=Trip+Image"

  // Price handling with fallbacks
  const displayPrice = trip.displayPrice || trip.salePrice || trip.price || trip.adultPrice || trip.normalPrice || 0

  const originalPrice = trip.originalPrice || trip.adultPrice || trip.normalPrice || displayPrice

  // Discount calculation
  const hasDiscount = trip.hasDiscount || (displayPrice > 0 && originalPrice > displayPrice)

  const discountPercentage =
    trip.discountPercentage ||
    trip.discount ||
    (hasDiscount && originalPrice > 0 ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0)

  // Rating and reviews
  const rating = trip.rating || 4.5
  const reviewCount = trip.reviewCount || trip.reviews || 0

  // Category and type
  const category = trip.category || trip.tripType || "Trip"

  // Slug for URL
  const slug = trip.slug || tripId

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
      <Link href={`/trips/${slug}`} className="flex-grow flex flex-col">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=250&width=400&text=Trip+Image"
            }}
          />

          {/* Discount Badge */}
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold">{discountPercentage}% OFF</Badge>
          )}

          {/* Trending Badge */}
          {trip.isTrending && <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>}

          {/* Popular Badge */}
          {trip.isPopular && !trip.isTrending && (
            <Badge className="absolute top-2 right-2 bg-blue-500 text-white">Popular</Badge>
          )}

          {/* Category Badge */}
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">{category}</Badge>
        </div>

        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3 flex-grow">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 h-14">{title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>

            {(trip.description || trip.overview) && (
              <p className="text-sm text-gray-600 line-clamp-2">{trip.description || trip.overview}</p>
            )}

            {rating > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                </div>
                {reviewCount > 0 && <span className="text-gray-500">({reviewCount} reviews)</span>}
              </div>
            )}
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
