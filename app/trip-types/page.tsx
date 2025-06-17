import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const tripTypes = [
  {
    id: 1,
    name: "Honeymoon",
    description: "Romantic getaways for couples",
    image: "/placeholder.svg?height=300&width=400",
    packages: 45,
    features: ["Romantic Settings", "Couple Activities", "Special Amenities"],
  },
  {
    id: 2,
    name: "Family",
    description: "Fun-filled trips for the whole family",
    image: "/placeholder.svg?height=300&width=400",
    packages: 62,
    features: ["Kid-Friendly", "Family Activities", "Safe Destinations"],
  },
  {
    id: 3,
    name: "Adventure",
    description: "Thrilling experiences for adventure seekers",
    image: "/placeholder.svg?height=300&width=400",
    packages: 38,
    features: ["Outdoor Activities", "Trekking", "Water Sports"],
  },
  {
    id: 4,
    name: "Luxury",
    description: "Premium experiences with top-notch amenities",
    image: "/placeholder.svg?height=300&width=400",
    packages: 29,
    features: ["5-Star Hotels", "Premium Services", "Exclusive Access"],
  },
  {
    id: 5,
    name: "Budget",
    description: "Affordable trips without compromising on experience",
    image: "/placeholder.svg?height=300&width=400",
    packages: 54,
    features: ["Cost-Effective", "Value for Money", "Essential Experiences"],
  },
  {
    id: 6,
    name: "Group",
    description: "Perfect for friends and large groups",
    image: "/placeholder.svg?height=300&width=400",
    packages: 41,
    features: ["Group Discounts", "Shared Experiences", "Team Activities"],
  },
]

export default function TripTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Trip Type</h1>
          <p className="text-xl opacity-90">Find the perfect trip style that matches your preferences</p>
        </div>
      </section>

      {/* Trip Types Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trip Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're planning a romantic honeymoon, family vacation, or adventure trip, we have the perfect
              package for every type of traveler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tripTypes.map((type) => (
              <Card
                key={type.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={type.image || "/placeholder.svg"}
                    alt={type.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Features:</h4>
                      <ul className="space-y-1">
                        {type.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-sm text-gray-500">{type.packages} packages available</span>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600 group" asChild>
                        <Link href={`/trip-types/${type.name.toLowerCase()}`}>
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
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
