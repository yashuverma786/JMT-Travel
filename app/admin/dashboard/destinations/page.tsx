"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react"

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
  status: "active" | "inactive"
  trips: number
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: "1",
      name: "Goa",
      country: "India",
      description: "Beautiful beaches and vibrant nightlife",
      image: "/placeholder.jpg",
      status: "active",
      trips: 12,
    },
    {
      id: "2",
      name: "Kerala",
      country: "India",
      description: "Backwaters and hill stations",
      image: "/placeholder.jpg",
      status: "active",
      trips: 8,
    },
    {
      id: "3",
      name: "Rajasthan",
      country: "India",
      description: "Royal palaces and desert landscapes",
      image: "/placeholder.jpg",
      status: "active",
      trips: 15,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setDestinations(destinations.filter((dest) => dest.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600">Manage travel destinations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      destination.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {destination.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-lg">{destination.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-2">{destination.country}</p>
                  <p className="text-sm text-gray-500 mb-3">{destination.description}</p>
                  <p className="text-sm font-medium mb-4">{destination.trips} trips available</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(destination.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
