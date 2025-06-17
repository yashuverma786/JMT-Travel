import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Star, Clock, Calendar, Search, Filter } from "lucide-react"

// Mock data for holiday packages
const holidayPackages = [
  {
    id: 1,
    title: "Enchanting Bali Adventure",
    destination: "Bali, Indonesia",
    image: "/placeholder.svg?height=300&width=400",
    duration: "7 Days / 6 Nights",
    price: 1299,
    rating: 4.8,
    reviews: 245,
    discount: 15,
    startDate: "Jun 15, 2024",
  },
  {
    id: 2,
    title: "Magical Switzerland Tour",
    destination: "Zurich, Switzerland",
    image: "/placeholder.svg?height=300&width=400",
    duration: "8 Days / 7 Nights",
    price: 2499,
    rating: 4.9,
    reviews: 189,
    discount: 10,
    startDate: "Jul 10, 2024",
  },
  {
    id: 3,
    title: "Serene Maldives Getaway",
    destination: "Malé, Maldives",
    image: "/placeholder.svg?height=300&width=400",
    duration: "5 Days / 4 Nights",
    price: 1899,
    rating: 4.7,
    reviews: 312,
    discount: 20,
    startDate: "Aug 5, 2024",
  },
  {
    id: 4,
    title: "Historic Rome Expedition",
    destination: "Rome, Italy",
    image: "/placeholder.svg?height=300&width=400",
    duration: "6 Days / 5 Nights",
    price: 1599,
    rating: 4.6,
    reviews: 178,
    discount: 12,
    startDate: "Sep 20, 2024",
  },
  {
    id: 5,
    title: "Amazing Thailand Experience",
    destination: "Bangkok, Thailand",
    image: "/placeholder.svg?height=300&width=400",
    duration: "9 Days / 8 Nights",
    price: 1399,
    rating: 4.5,
    reviews: 210,
    discount: 8,
    startDate: "Oct 15, 2024",
  },
  {
    id: 6,
    title: "Vibrant Vietnam Tour",
    destination: "Hanoi, Vietnam",
    image: "/placeholder.svg?height=300&width=400",
    duration: "10 Days / 9 Nights",
    price: 1699,
    rating: 4.7,
    reviews: 156,
    discount: 5,
    startDate: "Nov 5, 2024",
  },
  {
    id: 7,
    title: "Exotic Egypt Adventure",
    destination: "Cairo, Egypt",
    image: "/placeholder.svg?height=300&width=400",
    duration: "8 Days / 7 Nights",
    price: 1899,
    rating: 4.8,
    reviews: 189,
    discount: 0,
    startDate: "Dec 10, 2024",
  },
  {
    id: 8,
    title: "Majestic Morocco Journey",
    destination: "Marrakech, Morocco",
    image: "/placeholder.svg?height=300&width=400",
    duration: "7 Days / 6 Nights",
    price: 1499,
    rating: 4.6,
    reviews: 142,
    discount: 10,
    startDate: "Jan 15, 2025",
  },
]

// Filter sidebar component
function FilterSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search destinations" className="pl-9" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider defaultValue={[1000, 3000]} min={500} max={5000} step={100} />
        <div className="flex items-center justify-between mt-2 text-sm">
          <span>$500</span>
          <span>$5000</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Duration</h3>
        <div className="space-y-2">
          {["1-3 Days", "4-7 Days", "8-14 Days", "15+ Days"].map((duration) => (
            <div key={duration} className="flex items-center space-x-2">
              <Checkbox id={`duration-${duration}`} />
              <label
                htmlFor={`duration-${duration}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {duration}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Destinations</h3>
        <div className="space-y-2">
          {["Asia", "Europe", "Africa", "North America", "South America", "Australia"].map((continent) => (
            <div key={continent} className="flex items-center space-x-2">
              <Checkbox id={`continent-${continent}`} />
              <label
                htmlFor={`continent-${continent}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {continent}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                {Array(rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                {Array(5 - rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                <span className="ml-1">& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}

// Package card component
function PackageCard({ pkg }: { pkg: (typeof holidayPackages)[0] }) {
  const discountedPrice = pkg.price - (pkg.price * pkg.discount) / 100

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <Image
          src={pkg.image || "/placeholder.svg"}
          alt={pkg.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        {pkg.discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">{pkg.discount}% OFF</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 text-sm text-amber-500 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">{pkg.rating}</span>
          <span className="text-gray-500">({pkg.reviews} reviews)</span>
        </div>

        <h3 className="font-bold text-lg mb-1 line-clamp-1">{pkg.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{pkg.destination}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{pkg.startDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Starting from</p>
          <div className="flex items-center gap-2">
            {pkg.discount > 0 && <span className="text-sm text-muted-foreground line-through">${pkg.price}</span>}
            <p className="text-xl font-bold">${discountedPrice}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/holidays/${pkg.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Loading skeleton for packages
function PackagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="flex justify-between items-center pt-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HolidaysPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Holiday Packages</h1>
        <p className="text-muted-foreground">
          Discover our curated selection of holiday packages to destinations around the world
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="hidden lg:block">
              <FilterSidebar />
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">Showing {holidayPackages.length} packages</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="text-sm border rounded-md p-1">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Duration: Short to Long</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          <Suspense fallback={<PackagesSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {holidayPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </Suspense>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
