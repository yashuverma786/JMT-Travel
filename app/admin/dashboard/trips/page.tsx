"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import TripForm from "@/components/admin/trip-form"

interface Trip {
  _id: string
  title: string
  destinationId: string
  destinationName?: string
  durationDays: number
  durationNights: number
  adultPrice: number
  salePrice: number
  featuredImage: string
  status: string
  isTrending: boolean
  discountPercentage?: number
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
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

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.destinationName && trip.destinationName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await fetch(`/api/admin/trips/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setTrips(trips.filter((t) => t._id !== id))
        } else {
          alert("Failed to delete trip.")
        }
      } catch (error) {
        console.error("Error deleting trip:", error)
        alert("An error occurred while deleting the trip.")
      }
    }
  }

  const handleSave = async (data: any) => {
    setLoading(true)
    try {
      const url = editingTrip ? `/api/admin/trips/${editingTrip._id}` : "/api/admin/trips"
      const method = editingTrip ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchTrips()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save trip.")
      }
    } catch (error) {
      console.error("Error saving trip:", error)
      alert("An error occurred while saving the trip.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTrip(null)
  }

  const calculateDiscount = (adultPrice: number, salePrice: number) => {
    if (adultPrice && salePrice && salePrice < adultPrice) {
      return Math.round(((adultPrice - salePrice) / adultPrice) * 100)
    }
    return 0
  }

  if (showForm) {
    return <TripForm trip={editingTrip} onSubmit={handleSave} isLoading={loading} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
          <p className="text-gray-600">Manage travel packages and holiday trips</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trip
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Destination</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Pricing</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading trips...
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No trips found.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => {
                    const discount = calculateDiscount(trip.adultPrice, trip.salePrice)
                    return (
                      <tr key={trip._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Image
                            src={trip.featuredImage || "/placeholder.svg"}
                            alt={trip.title}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{trip.title}</div>
                          {trip.isTrending && <Badge className="bg-orange-500 text-white text-xs mt-1">Trending</Badge>}
                        </td>
                        <td className="p-4 text-gray-600">{trip.destinationName || "N/A"}</td>
                        <td className="p-4 text-gray-600">
                          {trip.durationDays}D/{trip.durationNights}N
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-green-600">₹{trip.salePrice?.toLocaleString()}</div>
                            {discount > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{trip.adultPrice?.toLocaleString()}
                                </span>
                                <Badge className="bg-red-500 text-white text-xs">{discount}% OFF</Badge>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              trip.status === "active"
                                ? "bg-green-500 text-white"
                                : trip.status === "draft"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-500 text-white"
                            }
                          >
                            {trip.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(trip._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
