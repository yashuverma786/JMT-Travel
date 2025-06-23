"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Trip {
  _id: string
  title: string
  destination: string
  tripType: string
  durationDays: number
  durationNights: number
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviewsCount?: number
  imageUrl: string
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  groupSize?: number
  status: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [formData, setFormData] = useState<Omit<Trip, "_id">>({
    title: "",
    destination: "",
    tripType: "",
    durationDays: 0,
    durationNights: 0,
    price: 0,
    originalPrice: undefined,
    discount: undefined,
    rating: undefined,
    reviewsCount: undefined,
    imageUrl: "",
    description: "",
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: [],
    groupSize: undefined,
    status: "active",
  })
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
        setTrips(data.trips)
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
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.tripType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setFormData({
      ...trip,
      // Ensure arrays are not null/undefined for form inputs
      highlights: trip.highlights || [],
      inclusions: trip.inclusions || [],
      exclusions: trip.exclusions || [],
      itinerary: trip.itinerary || [],
    })
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
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete trip.")
        }
      } catch (error) {
        console.error("Error deleting trip:", error)
        alert("An error occurred while deleting the trip.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingTrip ? `/api/admin/trips/${editingTrip._id}` : "/api/admin/trips"
      const method = editingTrip ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTrips() // Re-fetch all trips to update the list
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
    setFormData({
      title: "",
      destination: "",
      tripType: "",
      durationDays: 0,
      durationNights: 0,
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      rating: undefined,
      reviewsCount: undefined,
      imageUrl: "",
      description: "",
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
      groupSize: undefined,
      status: "active",
    })
  }

  const handleArrayChange = (field: keyof Omit<Trip, "_id">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }))
  }

  const handleItineraryChange = (index: number, field: string, value: string) => {
    const newItinerary = [...formData.itinerary]
    newItinerary[index] = { ...newItinerary[index], [field]: value }
    setFormData({ ...formData, itinerary: newItinerary })
  }

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", description: "" }],
    })
  }

  const removeItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    })
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{editingTrip ? "Edit Trip" : "Add New Trip"}</h1>
            <p className="text-gray-600">Manage travel packages and itineraries</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Exotic Bali Getaway"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g., Bali"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tripType">Trip Type</Label>
                  <Input
                    id="tripType"
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    placeholder="e.g., Beach, Adventure, Family"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/trip-image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="durationDays">Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="durationNights">Duration (Nights)</Label>
                  <Input
                    id="durationNights"
                    type="number"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupSize">Group Size (Optional)</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    value={formData.groupSize || ""}
                    onChange={(e) => setFormData({ ...formData, groupSize: Number(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹, Optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%, Optional)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount || ""}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (Optional)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || ""}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="reviewsCount">Reviews Count (Optional)</Label>
                  <Input
                    id="reviewsCount"
                    type="number"
                    value={formData.reviewsCount || ""}
                    onChange={(e) => setFormData({ ...formData, reviewsCount: Number(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the trip"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights.join(", ")}
                  onChange={(e) => handleArrayChange("highlights", e.target.value)}
                  placeholder="Beach activities, Cultural tours, Mountain trekking"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
                <Textarea
                  id="inclusions"
                  value={formData.inclusions.join(", ")}
                  onChange={(e) => handleArrayChange("inclusions", e.target.value)}
                  placeholder="Flights, Accommodation, Meals, Transfers"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
                <Textarea
                  id="exclusions"
                  value={formData.exclusions.join(", ")}
                  onChange={(e) => handleArrayChange("exclusions", e.target.value)}
                  placeholder="Visa fees, Personal expenses, Travel insurance"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Label>Itinerary</Label>
                {formData.itinerary.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Day {item.day}</h3>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItineraryDay(index)}>
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`itinerary-title-${index}`}>Title</Label>
                        <Input
                          id={`itinerary-title-${index}`}
                          value={item.title}
                          onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                          placeholder="e.g., Arrival in Bali & Beach Relaxation"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`itinerary-description-${index}`}>Description</Label>
                        <Textarea
                          id={`itinerary-description-${index}`}
                          value={item.description}
                          onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                          placeholder="Detailed activities for the day"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addItineraryDay}>
                  Add Day to Itinerary
                </Button>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTrip ? "Update Trip" : "Create Trip"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Manage all travel packages and tours</p>
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
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Loading trips...
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No trips found.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr key={trip._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={trip.imageUrl || "/placeholder.svg"}
                          alt={trip.title}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{trip.title}</td>
                      <td className="p-4 text-gray-600">{trip.destination}</td>
                      <td className="p-4 text-gray-600">{trip.tripType}</td>
                      <td className="p-4 text-gray-600">
                        {trip.durationDays}D/{trip.durationNights}N
                      </td>
                      <td className="p-4 font-semibold">₹{trip.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === "active"
                              ? "bg-green-100 text-green-800"
                              : trip.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {trip.status}
                        </span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
