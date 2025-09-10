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
  const [showForm, setShowForm] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    imageUrl: "",
    type: "city",
    popular: false,
    trending: false,
  })

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/admin/destinations")
      const data = await response.json()
      if (data.success) {
        setDestinations(data.destinations)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch destinations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingDestination ? `/api/admin/destinations/${editingDestination._id}` : "/api/admin/destinations"

      const method = editingDestination ? "PUT" : "POST"

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
        fetchDestinations()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error saving destination:", error)
      toast({
        title: "Error",
        description: "Failed to save destination",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      country: destination.country,
      description: destination.description,
      imageUrl: destination.imageUrl,
      type: destination.type,
      popular: destination.popular,
      trending: destination.trending,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchDestinations()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error deleting destination:", error)
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }))
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

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      description: "",
      imageUrl: "",
      type: "city",
      popular: false,
      trending: false,
    })
    setEditingDestination(null)
    setShowForm(false)
  }

  if (loading && destinations.length === 0) {
    return <div className="p-6">Loading destinations...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Destinations Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDestination ? "Edit Destination" : "Add New Destination"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                  />
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
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Image Upload</Label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  {formData.imageUrl && (
                    <div className="relative inline-block">
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, popular: !!checked }))}
                  />
                  <Label htmlFor="popular">Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={formData.trending}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, trending: !!checked }))}
                  />
                  <Label htmlFor="trending">Trending</Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingDestination ? "Update" : "Create"}
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
        {destinations.map((destination) => (
          <Card key={destination._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {destination.imageUrl && (
                  <img
                    src={destination.imageUrl || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.country}</p>
                </div>
                {destination.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">{destination.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{destination.type}</Badge>
                  {destination.popular && <Badge variant="secondary">Popular</Badge>}
                  {destination.trending && <Badge variant="secondary">Trending</Badge>}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(destination._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {destinations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No destinations found. Create your first destination!</p>
        </div>
      )}
    </div>
  )
}
