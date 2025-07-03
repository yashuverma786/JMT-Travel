"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripForm } from "@/components/admin/trip-form"
import { Plus, Search, Edit, Trash2, Eye, MapPin, Calendar, Star } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destination: any
  tripType: string
  status: string
  days: number
  nights: number
  adultPrice: number
  salePrice: number
  featuredImage: string
  isTrending: boolean
  createdAt: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/admin/trips")
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (tripData: any) => {
    try {
      const response = await fetch("/api/admin/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        await fetchTrips()
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error creating trip:", error)
    }
  }

  const handleUpdateTrip = async (tripData: any) => {
    if (!editingTrip) return

    try {
      const response = await fetch(`/api/admin/trips/${editingTrip._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        await fetchTrips()
        setEditingTrip(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error updating trip:", error)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const response = await fetch(`/api/admin/trips/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTrips()
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.tripType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calculateDiscount = (adultPrice: number, salePrice: number) => {
    if (adultPrice > 0 && salePrice > 0 && salePrice < adultPrice) {
      return Math.round(((adultPrice - salePrice) / adultPrice) * 100)
    }
    return 0
  }

  if (showForm) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{editingTrip ? "Edit Trip" : "Create New Trip"}</h1>
        </div>
        <TripForm
          trip={editingTrip}
          onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
          onCancel={() => {
            setShowForm(false)
            setEditingTrip(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trips Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading trips...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const discount = calculateDiscount(trip.adultPrice, trip.salePrice)
            return (
              <Card key={trip._id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={trip.featuredImage || "/placeholder.svg"}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                  {trip.isTrending && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {discount > 0 && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      {discount}% OFF
                    </Badge>
                  )}
                  <Badge
                    variant={trip.status === "published" ? "default" : "secondary"}
                    className="absolute bottom-2 left-2"
                  >
                    {trip.status}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{trip.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.destination?.name || "No destination"}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {trip.days}D/{trip.nights}N
                      </div>
                      <Badge variant="outline">{trip.tripType}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">₹{trip.salePrice.toLocaleString()}</span>
                          {discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.adultPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTrip(trip)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(`/trips/${trip._id}`, "_blank")}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTrip(trip._id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredTrips.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No trips found</p>
        </div>
      )}
    </div>
  )
}
