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
import { Plus, Edit, Trash2, X, Upload, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Trip {
  _id: string
  title: string
  description: string
  overview: string
  destinationId: string
  destinationName: string
  destinationCountry: string
  tripType: string
  category: string
  durationDays: number
  durationNights: number
  adultPrice: number
  normalPrice: number
  salePrice: number
  childPrice: number
  infantPrice: number
  images: string[]
  imageUrls: string[]
  featuredImage: string
  inclusions: string[]
  exclusions: string[]
  highlights: string[]
  itinerary: any[]
  status: string
  isTrending: boolean
  isPopular: boolean
  rating: number
  reviewCount: number
  maxGroupSize: number
  minAge: number
  difficulty: string
  bestTimeToVisit: string
  departureCity: string
  returnCity: string
  slug: string
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
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
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
    highlights: [] as string[],
    status: "active",
    isTrending: false,
    isPopular: false,
    rating: 4.5,
    reviewCount: 0,
    maxGroupSize: 15,
    minAge: 0,
    difficulty: "easy",
    bestTimeToVisit: "",
    departureCity: "",
    returnCity: "",
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newHighlight, setNewHighlight] = useState("")

  useEffect(() => {
    fetchTrips()
    fetchDestinations()
  }, [])

  const fetchTrips = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/trips", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const data = await response.json()
      if (data.success) {
        setTrips(data.trips)
      } else {
        throw new Error(data.message)
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
      setRefreshing(false)
    }
  }

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/destinations", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
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

      const token = localStorage.getItem("adminToken")
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        fetchTrips(false)
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
      title: trip.title || "",
      description: trip.description || "",
      overview: trip.overview || "",
      destinationId: trip.destinationId || "",
      tripType: trip.tripType || "leisure",
      durationDays: trip.durationDays || 1,
      durationNights: trip.durationNights || 0,
      adultPrice: trip.adultPrice || 0,
      salePrice: trip.salePrice || 0,
      childPrice: trip.childPrice || 0,
      infantPrice: trip.infantPrice || 0,
      images: trip.images || trip.imageUrls || [],
      inclusions: trip.inclusions || [],
      exclusions: trip.exclusions || [],
      highlights: trip.highlights || [],
      status: trip.status || "active",
      isTrending: trip.isTrending || false,
      isPopular: trip.isPopular || false,
      rating: trip.rating || 4.5,
      reviewCount: trip.reviewCount || 0,
      maxGroupSize: trip.maxGroupSize || 15,
      minAge: trip.minAge || 0,
      difficulty: trip.difficulty || "easy",
      bestTimeToVisit: trip.bestTimeToVisit || "",
      departureCity: trip.departureCity || "",
      returnCity: trip.returnCity || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/trips/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchTrips(false)
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

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData((prev) => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()],
      }))
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData((prev) => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()],
      }))
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }))
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      overview: "",
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
      highlights: [],
      status: "active",
      isTrending: false,
      isPopular: false,
      rating: 4.5,
      reviewCount: 0,
      maxGroupSize: 15,
      minAge: 0,
      difficulty: "easy",
      bestTimeToVisit: "",
      departureCity: "",
      returnCity: "",
    })
    setEditingTrip(null)
    setShowForm(false)
    setNewInclusion("")
    setNewExclusion("")
    setNewHighlight("")
  }

  if (loading && trips.length === 0) {
    return <div className="p-6">Loading trips...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trips Management</h1>
          <p className="text-gray-600">Manage your travel packages and itineraries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchTrips(false)} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trip
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTrip ? "Edit Trip" : "Add New Trip"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
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

              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="wildlife">Wildlife</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
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
                <div>
                  <Label htmlFor="maxGroupSize">Max Group Size</Label>
                  <Input
                    id="maxGroupSize"
                    type="number"
                    min="1"
                    value={formData.maxGroupSize}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, maxGroupSize: Number.parseInt(e.target.value) || 15 }))
                    }
                  />
                </div>
              </div>

              {/* Pricing */}
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

              {/* Images */}
              <div>
                <Label>Images</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    <Button type="button" disabled={uploading}>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
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

              {/* Highlights */}
              <div>
                <Label>Trip Highlights</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add a highlight"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    />
                    <Button type="button" onClick={addHighlight}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {highlight}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeHighlight(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <Label>Inclusions</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      placeholder="Add an inclusion"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                    />
                    <Button type="button" onClick={addInclusion}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.inclusions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.inclusions.map((inclusion, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {inclusion}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeInclusion(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Exclusions */}
              <div>
                <Label>Exclusions</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      placeholder="Add an exclusion"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
                    />
                    <Button type="button" onClick={addExclusion}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.exclusions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.exclusions.map((exclusion, index) => (
                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                          {exclusion}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeExclusion(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, rating: Number.parseFloat(e.target.value) || 4.5 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minAge">Minimum Age</Label>
                  <Input
                    id="minAge"
                    type="number"
                    min="0"
                    value={formData.minAge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minAge: Number.parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
                  <Input
                    id="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))}
                    placeholder="e.g., October to March"
                  />
                </div>
                <div>
                  <Label htmlFor="departureCity">Departure City</Label>
                  <Input
                    id="departureCity"
                    value={formData.departureCity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureCity: e.target.value }))}
                    placeholder="e.g., Delhi"
                  />
                </div>
                <div>
                  <Label htmlFor="returnCity">Return City</Label>
                  <Input
                    id="returnCity"
                    value={formData.returnCity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, returnCity: e.target.value }))}
                    placeholder="e.g., Delhi"
                  />
                </div>
              </div>

              {/* Status and Flags */}
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
                  {loading ? "Saving..." : editingTrip ? "Update Trip" : "Create Trip"}
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
          <Card key={trip._id} className="hover:shadow-lg transition-shadow">
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
                  <h3 className="font-semibold text-lg line-clamp-2">{trip.title}</h3>
                  <p className="text-sm text-gray-600">{trip.destinationName}</p>
                  <p className="text-sm text-gray-600">
                    {trip.durationDays} Days / {trip.durationNights} Nights
                  </p>
                </div>
                {trip.description && <p className="text-sm text-gray-700 line-clamp-2">{trip.description}</p>}
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-green-600">
                    ₹{(trip.salePrice || trip.adultPrice || 0).toLocaleString()}
                    {trip.salePrice && trip.salePrice < trip.adultPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{trip.adultPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{trip.rating || 4.5}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{trip.tripType}</Badge>
                  <Badge variant={trip.status === "active" ? "default" : "secondary"}>{trip.status}</Badge>
                  {trip.isTrending && <Badge className="bg-green-500">Trending</Badge>}
                  {trip.isPopular && <Badge className="bg-blue-500">Popular</Badge>}
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`/trips/${trip.slug || trip._id}`, "_blank")}
                  >
                    View
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
