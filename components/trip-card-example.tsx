import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge" // Assuming you have this

interface Trip {
  _id: string
  title: string
  imageUrls: string[]
  normalPrice: number
  salePrice?: number | null
  destination?: { name: string; country: string } // Populated destination
  durationDays?: number
}

interface TripCardProps {
  trip: Trip
}

export default function TripCardExample({ trip }: TripCardProps) {
  const displayPrice = trip.salePrice && trip.salePrice < trip.normalPrice ? trip.salePrice : trip.normalPrice
  const originalPrice = trip.normalPrice
  const isOnSale = trip.salePrice && trip.salePrice < trip.normalPrice
  let discountPercentage = 0

  if (isOnSale && trip.salePrice) {
    discountPercentage = Math.round(((originalPrice - trip.salePrice) / originalPrice) * 100)
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link href={`/trips/${trip._id}`} className="block">
        <div className="relative">
          <Image
            src={trip.imageUrls?.[0] || "/placeholder.svg?width=400&height=250&query=travel+view"}
            alt={trip.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          {isOnSale && discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">{trip.title}</h3>
          {trip.destination && (
            <p className="text-sm text-gray-600 mb-2">
              {trip.destination.name}, {trip.destination.country}
            </p>
          )}
          <div className="flex items-baseline mb-2">
            <p className="text-xl font-bold text-primary mr-2">₹{displayPrice.toLocaleString()}</p>
            {isOnSale && <p className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</p>}
          </div>
          {trip.durationDays && <p className="text-xs text-gray-500">{trip.durationDays} Days</p>}
        </div>
      </Link>
    </div>
  )
}
