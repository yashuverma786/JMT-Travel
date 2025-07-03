"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TripForm from "@/components/admin/trip-form"
import { Plus, Search, Edit, Trash2, Eye, MapPin, Calendar, Star } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destinationId: string
  destinationName?: string
  adultPrice: number
  salePrice: number
  durationDays: number
  durationNights: number
  featuredImage: string
  status: string
  isTrending: boolean
  createdAt: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/trips")
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      } else {
        console.error("Failed to fetch trips")
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (tripData: any) => {
    try {
      setSubmitting(true)
      const url = editingTrip ? `/api/admin/trips/${editingTrip._id}` : "/api/admin/trips"
      const method = editingTrip ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        await fetchTrips()
        setShowForm(false)
        setEditingTrip(null)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message || "Failed to save trip"}`)
      }
    } catch (error) {
      console.error("Error saving trip:", error)
      alert("Error saving trip. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setShowForm(true)
  }

  const handleDelete = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const response = await fetch(`/api/admin/trips/${tripId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTrips()
      } else {
        alert("Failed to delete trip")
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
      alert("Error deleting trip")
    }
  }

  const calculateDiscount = (adultPrice: number, salePrice: number) => {
    if (adultPrice && salePrice && salePrice < adultPrice) {
      return Math.round(((adultPrice - salePrice) / adultPrice) * 100)
    }
    return 0
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinationName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (showForm) {
    return <TripForm trip={editingTrip} onSubmit={handleSubmit} isLoading={submitting} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
          <p className="text-gray-600">Manage your travel packages and destinations</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Trip
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search trips by title or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "No trips match your current filters."
                : "Get started by creating your first trip package."}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const discount = calculateDiscount(trip.adultPrice, trip.salePrice)
            return (
              <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={trip.featuredImage || "/placeholder.svg"}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge
                      variant={
                        trip.status === "active" ? "default" : trip.status === "draft" ? "secondary" : "destructive"
                      }
                    >
                      {trip.status}
                    </Badge>
                    {trip.isTrending && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {discount > 0 && <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{trip.title}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.destinationName || "Unknown Destination"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {trip.durationDays} Days / {trip.durationNights} Nights
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">₹{trip.salePrice?.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{trip.adultPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(trip)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/trips/${trip._id}`, "_blank")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(trip._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
