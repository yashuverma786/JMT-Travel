// This is a new, simplified example. You'll need to adapt this to your existing trip card structure.
// Or modify your existing trip card component (e.g., within featured-packages.tsx or similar)
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge" // Assuming you have a Badge component

interface TripCardProps {
  trip: {
    _id: string
    title: string
    imageUrls: string[] // Assuming imageUrls is an array
    price: number
    salePrice?: number | null
    destinationName?: string // If you pass destination name
    durationDays?: number
    // ... other relevant trip properties
  }
}

export default function TripCard({ trip }: TripCardProps) {
  const displayPrice = trip.salePrice && trip.salePrice < trip.price ? trip.salePrice : trip.price
  const originalPrice = trip.price
  const isOnSale = trip.salePrice && trip.salePrice < trip.price
  let discountPercentage = 0
  if (isOnSale && trip.salePrice) {
    discountPercentage = Math.round(((originalPrice - trip.salePrice) / originalPrice) * 100)
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/trips/${trip._id}`} className="block">
        <div className="relative">
          <Image
            src={trip.imageUrls?.[0] || "/placeholder.svg?width=400&height=250&query=beautiful+travel+destination"}
            alt={trip.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          {isOnSale && discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">{trip.title}</h3>
          {trip.destinationName && <p className="text-sm text-gray-600 mb-2">{trip.destinationName}</p>}
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
