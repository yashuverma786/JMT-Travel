"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { FileUpload } from "@/components/ui/file-upload"

interface Destination {
  _id: string
  name: string
  country: string
  description: string
  imageUrl: string
  popular: boolean
  trending: boolean
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    imageUrl: "",
    popular: false,
    trending: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data.destinations)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      country: destination.country,
      description: destination.description,
      imageUrl: destination.imageUrl,
      popular: destination.popular,
      trending: destination.trending,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        const response = await fetch(`/api/admin/destinations/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setDestinations(destinations.filter((d) => d._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete destination.")
        }
      } catch (error) {
        console.error("Error deleting destination:", error)
        alert("An error occurred while deleting the destination.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
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

      if (response.ok) {
        await fetchDestinations()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save destination.")
      }
    } catch (error) {
      console.error("Error saving destination:", error)
      alert("An error occurred while saving the destination.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDestination(null)
    setFormData({
      name: "",
      country: "",
      description: "",
      imageUrl: "",
      popular: false,
      trending: false,
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
            <h1 className="text-3xl font-bold text-gray-900">
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </h1>
            <p className="text-gray-600">Manage travel destinations</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Destination Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Paris"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., France"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of the destination"
                />
              </div>

              {/* Replace Image URL with File Upload */}
              <FileUpload
                label="Destination Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url as string })}
                multiple={false}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: Boolean(checked) })}
                />
                <Label htmlFor="popular">Mark as Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) => setFormData({ ...formData, trending: Boolean(checked) })}
                />
                <Label htmlFor="trending">Mark as Trending</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingDestination ? "Update Destination" : "Create Destination"}
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
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600">Manage travel destinations for your website</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
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
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Country</th>
                  <th className="text-left p-4">Popular</th>
                  <th className="text-left p-4">Trending</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading destinations...
                    </td>
                  </tr>
                ) : filteredDestinations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No destinations found.
                    </td>
                  </tr>
                ) : (
                  filteredDestinations.map((destination) => (
                    <tr key={destination._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={destination.imageUrl || "/placeholder.svg"}
                          alt={destination.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{destination.name}</td>
                      <td className="p-4 text-gray-600">{destination.country}</td>
                      <td className="p-4">
                        {destination.popular ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-red-500">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {destination.trending ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-red-500">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(destination._id)}
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
