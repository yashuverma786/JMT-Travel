import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star } from "lucide-react"

export interface Trip {
  _id: string
  title: string
  destinationName: string
  durationDays: number
  imageUrls: string[]
  normalPrice?: number
  salePrice?: number
  rating?: number
  category?: string
  overview: string
}

export default function TripCard({ trip }: { trip: Trip }) {
  const hasDiscount =
    typeof trip.salePrice === "number" && typeof trip.normalPrice === "number" && trip.salePrice < trip.normalPrice
  const displayPrice = hasDiscount ? trip.salePrice : trip.normalPrice
  const discountPercentage = hasDiscount
    ? Math.round(((trip.normalPrice! - trip.salePrice!) / trip.normalPrice!) * 100)
    : 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
      <Link href={`/trips/${trip._id}`} className="flex-grow">
        <div className="relative">
          <Image
            src={trip.imageUrls?.[0] || "/placeholder.svg?height=200&width=300&query=trip"}
            alt={trip.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
          )}
          {trip.category && <Badge className="absolute top-2 right-2 bg-blue-500 text-white">{trip.category}</Badge>}
        </div>

        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 h-14">{trip.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destinationName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{trip.durationDays} Days</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              {typeof trip.rating === "number" && trip.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{trip.rating}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {typeof displayPrice === "number" ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₹{displayPrice.toLocaleString("en-IN")}</span>
                {hasDiscount && typeof trip.normalPrice === "number" && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{trip.normalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-lg font-bold text-blue-600">Price on request</span>
            )}
            <span className="text-xs text-gray-500">per person</span>
          </div>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href={`/trips/${trip._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
