import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Users } from "lucide-react"

interface TripCardProps {
  trip: {
    _id: string
    title: string
    imageUrls: string[]
    normalPrice: number
    salePrice?: number | null
    destinationName?: string
    durationDays?: number
    groupSize?: string
    overview?: string
  }
}

export default function EnhancedTripCard({ trip }: TripCardProps) {
  const hasDiscount = trip.salePrice && trip.salePrice < trip.normalPrice
  const displayPrice = hasDiscount ? trip.salePrice : trip.normalPrice
  const discountPercentage = hasDiscount
    ? Math.round(((trip.normalPrice - trip.salePrice!) / trip.normalPrice) * 100)
    : 0

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/trips/${trip._id}`} className="block">
        <div className="relative">
          <Image
            src={trip.imageUrls?.[0] || "/placeholder.svg?width=400&height=250&query=beautiful+travel+destination"}
            alt={trip.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white font-bold">{discountPercentage}% OFF</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>

          {trip.destinationName && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {trip.destinationName}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {trip.durationDays && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {trip.durationDays} Days
              </div>
            )}
            {trip.groupSize && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {trip.groupSize}
              </div>
            )}
          </div>

          {trip.overview && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.overview}</p>}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">₹{displayPrice?.toLocaleString()}</span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">₹{trip.normalPrice.toLocaleString()}</span>
                )}
              </div>
              <span className="text-xs text-gray-500">per person</span>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              View Details
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
