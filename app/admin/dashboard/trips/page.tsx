"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { TripForm } from "@/components/admin/trip-form"

interface Trip {
  id: string
  title: string
  destination: string
  price: number
  duration: string
  status: "active" | "inactive" | "draft"
  image: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "1",
      title: "Goa Beach Paradise",
      destination: "Goa",
      price: 15999,
      duration: "4 Days 3 Nights",
      status: "active",
      image: "/placeholder.jpg",
    },
    {
      id: "2",
      title: "Kerala Backwaters",
      destination: "Kerala",
      price: 22999,
      duration: "6 Days 5 Nights",
      status: "active",
      image: "/placeholder.jpg",
    },
    {
      id: "3",
      title: "Rajasthan Royal Tour",
      destination: "Rajasthan",
      price: 35999,
      duration: "8 Days 7 Nights",
      status: "draft",
      image: "/placeholder.jpg",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id))
  }

  const handleSave = (tripData: any) => {
    if (editingTrip) {
      setTrips(trips.map((trip) => (trip.id === editingTrip.id ? { ...trip, ...tripData } : trip)))
    } else {
      const newTrip: Trip = {
        id: Date.now().toString(),
        ...tripData,
        status: "draft" as const,
      }
      setTrips([...trips, newTrip])
    }
    setShowForm(false)
    setEditingTrip(null)
  }

  if (showForm) {
    return (
      <TripForm
        trip={editingTrip}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setEditingTrip(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Manage your travel packages</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <img src={trip.image || "/placeholder.svg"} alt={trip.title} className="w-full h-full object-cover" />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      trip.status === "active"
                        ? "bg-green-500"
                        : trip.status === "draft"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  >
                    {trip.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
                  <p className="text-gray-600 mb-2">{trip.destination}</p>
                  <p className="text-sm text-gray-500 mb-2">{trip.duration}</p>
                  <p className="text-xl font-bold text-blue-600 mb-4">₹{trip.price.toLocaleString()}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(trip.id)}
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
