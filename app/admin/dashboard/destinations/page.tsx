"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Eye, MapPin, Star, TrendingUp, Loader2, RefreshCw } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-context"
import Image from "next/image"

interface Destination {
  _id: string
  name: string
  country: string
  description: string
  imageUrl: string
  type: string
  popular: boolean
  trending: boolean
  createdAt: string
  updatedAt: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { apiCall } = useAdmin()

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    imageUrl: "",
    type: "",
    popular: false,
    trending: false,
  })

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const response = await apiCall("/api/admin/destinations")

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDestinations(data.destinations || [])
        } else {
          console.error("Failed to fetch destinations:", data.message)
          setDestinations([])
        }
      } else {
        console.error("Failed to fetch destinations:", response.status)
        setDestinations([])
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
      setDestinations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const url = editingDestination ? `/api/admin/destinations/${editingDestination._id}` : "/api/admin/destinations"

      const method = editingDestination ? "PUT" : "POST"

      const response = await apiCall(url, {
        method,
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert(editingDestination ? "Destination updated successfully!" : "Destination created successfully!")
          setShowForm(false)
          setEditingDestination(null)
          resetForm()
          fetchDestinations(false)
        } else {
          alert(`Error: ${data.message}`)
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error("Error saving destination:", error)
      alert("Error saving destination")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      country: destination.country,
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
      type: destination.type || "",
      popular: destination.popular || false,
      trending: destination.trending || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (destinationId: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    try {
      const response = await apiCall(`/api/admin/destinations/${destinationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDestinations(destinations.filter((dest) => dest._id !== destinationId))
        alert("Destination deleted successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error("Error deleting destination:", error)
      alert("Error deleting destination")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      description: "",
      imageUrl: "",
      type: "",
      popular: false,
      trending: false,
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDestination(null)
    resetForm()
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{editingDestination ? "Edit Destination" : "Add New Destination"}</h1>
            <p className="text-gray-600">
              {editingDestination ? "Update destination information" : "Create a new travel destination"}
            </p>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Destination Details</CardTitle>
            <CardDescription>Fill in the information for the destination</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Destination Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Goa, Kerala, Rajasthan"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., India, Thailand, Nepal"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Destination Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="hill station">Hill Station</SelectItem>
                      <SelectItem value="heritage">Heritage</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the destination, its attractions, and what makes it special..."
                  rows={4}
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData({ ...formData, popular: checked as boolean })}
                  />
                  <Label htmlFor="popular">Mark as Popular</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={formData.trending}
                    onCheckedChange={(checked) => setFormData({ ...formData, trending: checked as boolean })}
                  />
                  <Label htmlFor="trending">Mark as Trending</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingDestination ? "Updating..." : "Creating..."}
                    </>
                  ) : editingDestination ? (
                    "Update Destination"
                  ) : (
                    "Create Destination"
                  )}
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
          <h1 className="text-3xl font-bold">Destinations Management</h1>
          <p className="text-gray-600">Manage travel destinations and locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchDestinations(false)} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Destination
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span className="text-lg">Loading destinations...</span>
        </div>
      ) : destinations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first destination</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Destination
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={destination.imageUrl || "/placeholder.svg?height=200&width=400"}
                  alt={destination.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=400"
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {destination.trending && (
                    <Badge className="bg-green-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {destination.popular && (
                    <Badge className="bg-red-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{destination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {destination.country}
                    </CardDescription>
                  </div>
                  {destination.type && (
                    <Badge variant="outline" className="text-xs">
                      {destination.type}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {destination.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(destination.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`, "_blank")
                      }
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(destination)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(destination._id)}
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
