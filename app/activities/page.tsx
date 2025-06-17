import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Users } from "lucide-react"

const activities = [
  {
    id: 1,
    name: "Scuba Diving in Goa",
    location: "Goa",
    image: "/placeholder.svg?height=250&width=350",
    duration: "4 Hours",
    price: 3500,
    rating: 4.6,
    reviews: 128,
    category: "Water Sports",
    difficulty: "Beginner",
    groupSize: "2-8 people",
  },
  {
    id: 2,
    name: "Trekking in Himachal",
    location: "Himachal Pradesh",
    image: "/placeholder.svg?height=250&width=350",
    duration: "2 Days",
    price: 5500,
    rating: 4.8,
    reviews: 95,
    category: "Adventure",
    difficulty: "Moderate",
    groupSize: "4-12 people",
  },
  {
    id: 3,
    name: "Desert Safari in Rajasthan",
    location: "Rajasthan",
    image: "/placeholder.svg?height=250&width=350",
    duration: "6 Hours",
    price: 2800,
    rating: 4.5,
    reviews: 156,
    category: "Cultural",
    difficulty: "Easy",
    groupSize: "2-15 people",
  },
  {
    id: 4,
    name: "River Rafting in Rishikesh",
    location: "Uttarakhand",
    image: "/placeholder.svg?height=250&width=350",
    duration: "3 Hours",
    price: 1500,
    rating: 4.7,
    reviews: 203,
    category: "Adventure",
    difficulty: "Moderate",
    groupSize: "6-12 people",
  },
  {
    id: 5,
    name: "Backwater Cruise in Kerala",
    location: "Kerala",
    image: "/placeholder.svg?height=250&width=350",
    duration: "8 Hours",
    price: 4200,
    rating: 4.4,
    reviews: 87,
    category: "Nature",
    difficulty: "Easy",
    groupSize: "2-20 people",
  },
  {
    id: 6,
    name: "Paragliding in Manali",
    location: "Himachal Pradesh",
    image: "/placeholder.svg?height=250&width=350",
    duration: "2 Hours",
    price: 3000,
    rating: 4.9,
    reviews: 74,
    category: "Adventure",
    difficulty: "Beginner",
    groupSize: "1-4 people",
  },
]

const categories = ["All", "Adventure", "Water Sports", "Cultural", "Nature"]

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exciting Activities</h1>
          <p className="text-xl opacity-90">Discover thrilling experiences and unforgettable adventures</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Activities</h2>
            <p className="text-gray-600">Choose from our wide range of exciting activities and experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    width={350}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{activity.category}</Badge>
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white">{activity.difficulty}</Badge>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        {activity.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{activity.groupSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{activity.rating}</span>
                      <span className="text-gray-500">({activity.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-2xl font-bold">₹{activity.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 block">per person</span>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                        <Link href={`/activities/${activity.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
