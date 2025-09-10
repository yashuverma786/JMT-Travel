"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Trip {
  _id: string
  title: string
  description: string
  destinationId: string
  destinationName: string
  tripType: string
  durationDays: number
  durationNights: number
  adultPrice: number
  salePrice: number
  childPrice: number
  infantPrice: number
  images: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: any[]
  status: string
  isTrending: boolean
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

interface Destination {
  _id: string
  name: string
  country: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destinationId: "",
    tripType: "leisure",
    durationDays: 1,
    durationNights: 0,
    adultPrice: 0,
    salePrice: 0,
    childPrice: 0,
    infantPrice: 0,
    images: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    status: "active",
    isTrending: false,
    isPopular: false,
  })

  useEffect(() => {
    fetchTrips()
    fetchDestinations()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/admin/trips")
      const data = await response.json()
      if (data.success) {
        setTrips(data.trips)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast({
        title: "Error",
        description: "Failed to fetch trips",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/admin/destinations")
      const data = await response.json()
      if (data.success) {
        setDestinations(data.destinations)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        resetForm()
        fetchTrips()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error saving trip:", error)
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setFormData({
      title: trip.title,
      description: trip.description,
      destinationId: trip.destinationId,
      tripType: trip.tripType,
      durationDays: trip.durationDays,
      durationNights: trip.durationNights,
      adultPrice: trip.adultPrice,
      salePrice: trip.salePrice,
      childPrice: trip.childPrice,
      infantPrice: trip.infantPrice,
      images: trip.images || [],
      inclusions: trip.inclusions || [],
      exclusions: trip.exclusions || [],
      status: trip.status,
      isTrending: trip.isTrending,
      isPopular: trip.isPopular,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const response = await fetch(`/api/admin/trips/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchTrips()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }))
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      destinationId: "",
      tripType: "leisure",
      durationDays: 1,
      durationNights: 0,
      adultPrice: 0,
      salePrice: 0,
      childPrice: 0,
      infantPrice: 0,
      images: [],
      inclusions: [],
      exclusions: [],
      status: "active",
      isTrending: false,
      isPopular: false,
    })
    setEditingTrip(null)
    setShowForm(false)
  }

  if (loading && trips.length === 0) {
    return <div className="p-6">Loading trips...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trips Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trip
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTrip ? "Edit Trip" : "Add New Trip"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destinationId">Destination *</Label>
                  <Select
                    value={formData.destinationId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, destinationId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest._id} value={dest._id}>
                          {dest.name}, {dest.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tripType">Trip Type</Label>
                  <Select
                    value={formData.tripType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tripType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leisure">Leisure</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="honeymoon">Honeymoon</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="durationDays">Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="1"
                    value={formData.durationDays}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, durationDays: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="durationNights">Duration (Nights)</Label>
                  <Input
                    id="durationNights"
                    type="number"
                    min="0"
                    value={formData.durationNights}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, durationNights: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="adultPrice">Adult Price *</Label>
                  <Input
                    id="adultPrice"
                    type="number"
                    min="0"
                    value={formData.adultPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, adultPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, salePrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="childPrice">Child Price</Label>
                  <Input
                    id="childPrice"
                    type="number"
                    min="0"
                    value={formData.childPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, childPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="infantPrice">Infant Price</Label>
                  <Input
                    id="infantPrice"
                    type="number"
                    min="0"
                    value={formData.infantPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, infantPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Images</Label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Trip image ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
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
                <div className="flex items-center space-x-4 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isTrending"
                      checked={formData.isTrending}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isTrending: !!checked }))}
                    />
                    <Label htmlFor="isTrending">Trending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPopular: !!checked }))}
                    />
                    <Label htmlFor="isPopular">Popular</Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTrip ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {trip.images && trip.images.length > 0 && (
                  <img
                    src={trip.images[0] || "/placeholder.svg"}
                    alt={trip.title}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{trip.title}</h3>
                  <p className="text-sm text-gray-600">{trip.destinationName}</p>
                  <p className="text-sm text-gray-600">
                    {trip.durationDays} Days / {trip.durationNights} Nights
                  </p>
                </div>
                {trip.description && <p className="text-sm text-gray-700 line-clamp-2">{trip.description}</p>}
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-green-600">
                    ₹{trip.salePrice || trip.adultPrice}
                    {trip.salePrice && trip.salePrice < trip.adultPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{trip.adultPrice}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{trip.tripType}</Badge>
                  <Badge variant={trip.status === "active" ? "default" : "secondary"}>{trip.status}</Badge>
                  {trip.isTrending && <Badge variant="secondary">Trending</Badge>}
                  {trip.isPopular && <Badge variant="secondary">Popular</Badge>}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(trip._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trips.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trips found. Create your first trip!</p>
        </div>
      )}
    </div>
  )
}
