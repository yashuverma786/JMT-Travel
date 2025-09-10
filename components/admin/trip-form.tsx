"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-context"

interface Destination {
  _id: string
  name: string
  country: string
}

interface Trip {
  _id?: string
  title: string
  description: string
  destinationId: string
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
  itinerary: Array<{ day: number; title: string; description: string }>
  status: string
  isTrending: boolean
  isPopular: boolean
}

interface TripFormProps {
  trip?: Trip | null
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function TripForm({ trip, onSubmit, onCancel, isLoading }: TripFormProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [formData, setFormData] = useState<Trip>({
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
    itinerary: [],
    status: "active",
    isTrending: false,
    isPopular: false,
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newItinerary, setNewItinerary] = useState({ day: 1, title: "", description: "" })

  const { apiCall } = useAdmin()

  useEffect(() => {
    fetchDestinations()
    if (trip) {
      setFormData(trip)
    }
  }, [trip])

  const fetchDestinations = async () => {
    try {
      const response = await apiCall("/api/admin/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, newInclusion.trim()],
      })
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions.filter((_, i) => i !== index),
    })
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData({
        ...formData,
        exclusions: [...formData.exclusions, newExclusion.trim()],
      })
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: formData.exclusions.filter((_, i) => i !== index),
    })
  }

  const addItinerary = () => {
    if (newItinerary.title.trim() && newItinerary.description.trim()) {
      setFormData({
        ...formData,
        itinerary: [...formData.itinerary, { ...newItinerary }],
      })
      setNewItinerary({ day: newItinerary.day + 1, title: "", description: "" })
    }
  }

  const removeItinerary = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{trip ? "Edit Trip" : "Create New Trip"}</h1>
          <p className="text-gray-600">Fill in the details for the trip package</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential trip details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Trip Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Amazing Goa Beach Holiday"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the trip experience..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Select
                  value={formData.destinationId}
                  onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                  required
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

              <div>
                <Label htmlFor="tripType">Trip Type</Label>
                <Select
                  value={formData.tripType}
                  onValueChange={(value) => setFormData({ ...formData, tripType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="spiritual">Spiritual</SelectItem>
                    <SelectItem value="honeymoon">Honeymoon</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="durationDays">Duration (Days) *</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="1"
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
                    min="0"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isTrending"
                    checked={formData.isTrending}
                    onCheckedChange={(checked) => setFormData({ ...formData, isTrending: checked as boolean })}
                  />
                  <Label htmlFor="isTrending">Trending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
                  />
                  <Label htmlFor="isPopular">Popular</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set prices for different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adultPrice">Adult Price (₹) *</Label>
                <Input
                  id="adultPrice"
                  type="number"
                  min="0"
                  value={formData.adultPrice}
                  onChange={(e) => setFormData({ ...formData, adultPrice: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="salePrice">Sale Price (₹)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  min="0"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  placeholder="Leave empty to use adult price"
                />
              </div>

              <div>
                <Label htmlFor="childPrice">Child Price (₹)</Label>
                <Input
                  id="childPrice"
                  type="number"
                  min="0"
                  value={formData.childPrice}
                  onChange={(e) => setFormData({ ...formData, childPrice: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="infantPrice">Infant Price (₹)</Label>
                <Input
                  id="infantPrice"
                  type="number"
                  min="0"
                  value={formData.infantPrice}
                  onChange={(e) => setFormData({ ...formData, infantPrice: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload trip images</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              label="Trip Images"
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
              multiple={true}
            />
          </CardContent>
        </Card>

        {/* Inclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Inclusions</CardTitle>
            <CardDescription>What's included in the trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="e.g., Hotel accommodation"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
              />
              <Button type="button" onClick={addInclusion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.inclusions.map((inclusion, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {inclusion}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => removeInclusion(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Exclusions</CardTitle>
            <CardDescription>What's not included in the trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="e.g., Personal expenses"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
              />
              <Button type="button" onClick={addExclusion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.exclusions.map((exclusion, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {exclusion}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => removeExclusion(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
            <CardDescription>Day-wise trip schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                type="number"
                min="1"
                value={newItinerary.day}
                onChange={(e) => setNewItinerary({ ...newItinerary, day: Number(e.target.value) })}
                placeholder="Day"
              />
              <Input
                value={newItinerary.title}
                onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                placeholder="Day title"
              />
              <Input
                value={newItinerary.description}
                onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                placeholder="Day description"
              />
              <Button type="button" onClick={addItinerary}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.itinerary.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <strong>Day {item.day}:</strong> {item.title} - {item.description}
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => removeItinerary(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {trip ? "Updating..." : "Creating..."}
              </>
            ) : trip ? (
              "Update Trip"
            ) : (
              "Create Trip"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
