import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Users, Star } from "lucide-react"

interface TripCardProps {
  trip: {
    _id: string
    id?: string
    title: string
    imageUrls?: string[]
    imageUrl?: string
    featuredImage?: string
    image?: string
    normalPrice?: number
    adultPrice?: number
    salePrice?: number
    price?: number
    displayPrice?: number
    originalPrice?: number
    destinationName?: string
    destination?: string
    durationDays?: number
    durationNights?: number
    duration?: string
    groupSize?: string
    overview?: string
    description?: string
    rating?: number
    reviewCount?: number
    reviews?: number
    category?: string
    tripType?: string
    hasDiscount?: boolean
    discount?: number
    discountPercentage?: number
    isTrending?: boolean
    isPopular?: boolean
    slug?: string
  }
  className?: string
}

export default function EnhancedTripCard({ trip, className = "" }: TripCardProps) {
  // Standardized data extraction
  const tripId = trip._id || trip.id || ""
  const title = trip.title || "Untitled Trip"
  const destination = trip.destinationName || trip.destination || "Unknown Destination"

  // Duration handling
  const durationDays = trip.durationDays || 1
  const durationNights = trip.durationNights || (durationDays > 0 ? durationDays - 1 : 0)
  const duration = trip.duration || `${durationDays} Days`

  // Image handling
  const imageUrl =
    trip.featuredImage ||
    trip.imageUrl ||
    trip.image ||
    (trip.imageUrls && trip.imageUrls[0]) ||
    "/placeholder.svg?height=250&width=400&text=Beautiful+Travel+Destination"

  // Price handling
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

  // Category
  const category = trip.category || trip.tripType || "Trip"

  // Slug for URL
  const slug = trip.slug || tripId

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      <Link href={`/trips/${slug}`} className="block">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=250&width=400&text=Beautiful+Travel+Destination"
            }}
          />

          {/* Discount Badge */}
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg">
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{category}</Badge>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{destination}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {duration}
            </div>
            {trip.groupSize && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {trip.groupSize}
              </div>
            )}
          </div>

          {(trip.overview || trip.description) && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.overview || trip.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                {displayPrice > 0 ? (
                  <>
                    <span className="text-xl font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
                    {hasDiscount && originalPrice > displayPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                    )}
                  </>
                ) : (
                  <span className="text-lg font-bold text-blue-600">Price on request</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">per person</span>
                {reviewCount > 0 && <span className="text-xs text-gray-400">({reviewCount} reviews)</span>}
              </div>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              View Details
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
