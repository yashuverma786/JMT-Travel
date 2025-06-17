"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"

const nationalDestinations = [
  { id: 1, name: "Goa", packages: 45, image: "/placeholder.svg?height=200&width=200", description: "Beach Paradise" },
  {
    id: 2,
    name: "Kerala",
    packages: 38,
    image: "/placeholder.svg?height=200&width=200",
    description: "God's Own Country",
  },
  {
    id: 3,
    name: "Rajasthan",
    packages: 52,
    image: "/placeholder.svg?height=200&width=200",
    description: "Royal Heritage",
  },
  {
    id: 4,
    name: "Himachal",
    packages: 29,
    image: "/placeholder.svg?height=200&width=200",
    description: "Mountain Beauty",
  },
  {
    id: 5,
    name: "Kashmir",
    packages: 24,
    image: "/placeholder.svg?height=200&width=200",
    description: "Paradise on Earth",
  },
  {
    id: 6,
    name: "Uttarakhand",
    packages: 31,
    image: "/placeholder.svg?height=200&width=200",
    description: "Dev Bhoomi",
  },
]

const internationalDestinations = [
  { id: 7, name: "Dubai", packages: 35, image: "/placeholder.svg?height=200&width=200", description: "Modern Marvel" },
  {
    id: 8,
    name: "Thailand",
    packages: 42,
    image: "/placeholder.svg?height=200&width=200",
    description: "Land of Smiles",
  },
  {
    id: 9,
    name: "Singapore",
    packages: 28,
    image: "/placeholder.svg?height=200&width=200",
    description: "Garden City",
  },
  {
    id: 10,
    name: "Maldives",
    packages: 18,
    image: "/placeholder.svg?height=200&width=200",
    description: "Tropical Paradise",
  },
  { id: 11, name: "Bali", packages: 33, image: "/placeholder.svg?height=200&width=200", description: "Island of Gods" },
  {
    id: 12,
    name: "Europe",
    packages: 25,
    image: "/placeholder.svg?height=200&width=200",
    description: "Historic Charm",
  },
]

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState("national")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Amazing Destinations</h1>
          <p className="text-xl opacity-90">
            Discover the world's most beautiful places with our curated travel packages
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="national" className="w-full" onValueChange={setActiveTab}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Destination</h2>
              <TabsList className="grid w-fit grid-cols-2 mx-auto">
                <TabsTrigger value="national" className="px-8">
                  National
                </TabsTrigger>
                <TabsTrigger value="international" className="px-8">
                  International
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="national">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {nationalDestinations.map((destination) => (
                  <Link key={destination.id} href={`/destinations/${destination.name.toLowerCase()}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 group-hover:border-blue-300 transition-colors">
                            <Image
                              src={destination.image || "/placeholder.svg"}
                              alt={destination.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{destination.description}</p>
                        <p className="text-sm text-blue-600 font-medium">{destination.packages} packages available</p>
                        <div className="mt-4 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium mr-1">Explore</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="international">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {internationalDestinations.map((destination) => (
                  <Link key={destination.id} href={`/destinations/${destination.name.toLowerCase()}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 group-hover:border-blue-300 transition-colors">
                            <Image
                              src={destination.image || "/placeholder.svg"}
                              alt={destination.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{destination.description}</p>
                        <p className="text-sm text-blue-600 font-medium">{destination.packages} packages available</p>
                        <div className="mt-4 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium mr-1">Explore</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
