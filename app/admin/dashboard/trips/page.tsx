"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Loader2, RefreshCw } from "lucide-react"
import TripForm from "@/components/admin/trip-form"
import { useAdmin } from "@/components/admin/admin-context"

interface Trip {
  _id: string
  title: string
  destinationName: string
  tripType: string
  status: string
  durationDays: number
  durationNights: number
  adultPrice: number
  salePrice: number
  isTrending: boolean
  createdAt: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { apiCall } = useAdmin()

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const response = await apiCall("/api/admin/trips")

      if (response.ok) {
        const data = await response.json()
        setTrips(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch trips")
        setTrips([])
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
      setTrips([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCreateTrip = async (tripData: any) => {
    try {
      setFormLoading(true)
      const response = await apiCall("/api/admin/trips", {
        method: "POST",
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        const newTrip = await response.json()
        setTrips([newTrip, ...trips])
        setShowForm(false)
        alert("Trip created successfully!")
        fetchTrips(false)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error("Error creating trip:", error)
      alert("Error creating trip")
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTrip = async (tripData: any) => {
    if (!editingTrip) return

    try {
      setFormLoading(true)
      const response = await apiCall(`/api/admin/trips/${editingTrip._id}`, {
        method: "PUT",
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        const result = await response.json()
        setTrips(trips.map((trip) => (trip._id === editingTrip._id ? result.trip : trip)))
        setEditingTrip(null)
        setShowForm(false)
        alert("Trip updated successfully!")
        fetchTrips(false)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error("Error updating trip:", error)
      alert("Error updating trip")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const response = await apiCall(`/api/admin/trips/${tripId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTrips(trips.filter((trip) => trip._id !== tripId))
        alert("Trip deleted successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
      alert("Error deleting trip")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (showForm) {
    return (
      <TripForm
        trip={editingTrip}
        onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
        onCancel={() => {
          setShowForm(false)
          setEditingTrip(null)
        }}
        isLoading={formLoading}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trips Management</h1>
          <p className="text-gray-600">Manage your travel packages and itineraries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchTrips(false)} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trip
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span className="text-lg">Loading trips...</span>
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first trip package</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{trip.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {trip.destinationName} • {trip.durationDays}D/{trip.durationNights}N
                    </CardDescription>
                  </div>
                  {trip.isTrending && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Trending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium">{trip.tripType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">₹{trip.salePrice.toLocaleString()}</span>
                      {trip.adultPrice > trip.salePrice && (
                        <div className="text-xs text-gray-500 line-through">₹{trip.adultPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/trips/${trip._id}`, "_blank")}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTrip(trip)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTrip(trip._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
