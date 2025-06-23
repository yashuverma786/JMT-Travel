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

interface TripType {
  _id: string
  name: string
  description: string
  iconUrl: string
  createdAt: string
  updatedAt: string
}

export default function TripTypesPage() {
  const [tripTypes, setTripTypes] = useState<TripType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTripType, setEditingTripType] = useState<TripType | null>(null)
  const [formData, setFormData] = useState<Omit<TripType, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    iconUrl: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTripTypes()
  }, [])

  const fetchTripTypes = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/trip-types")
      if (response.ok) {
        const data = await response.json()
        setTripTypes(data.tripTypes)
      }
    } catch (error) {
      console.error("Error fetching trip types:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTripTypes = tripTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (tripType: TripType) => {
    setEditingTripType(tripType)
    setFormData({
      name: tripType.name,
      description: tripType.description,
      iconUrl: tripType.iconUrl,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip type?")) {
      try {
        const response = await fetch(`/api/admin/trip-types/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setTripTypes(tripTypes.filter((t) => t._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete trip type.")
        }
      } catch (error) {
        console.error("Error deleting trip type:", error)
        alert("An error occurred while deleting the trip type.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingTripType ? `/api/admin/trip-types/${editingTripType._id}` : "/api/admin/trip-types"
      const method = editingTripType ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTripTypes() // Re-fetch all trip types to update the list
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save trip type.")
      }
    } catch (error) {
      console.error("Error saving trip type:", error)
      alert("An error occurred while saving the trip type.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTripType(null)
    setFormData({
      name: "",
      description: "",
      iconUrl: "",
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
              {editingTripType ? "Edit Trip Type" : "Add New Trip Type"}
            </h1>
            <p className="text-gray-600">Define categories for your trips</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Trip Type Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Adventure, Family, Romantic"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of this trip type"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="iconUrl">Icon URL (Optional)</Label>
                <Input
                  id="iconUrl"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  placeholder="https://example.com/icon.svg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTripType ? "Update Trip Type" : "Create Trip Type"}
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
          <h1 className="text-3xl font-bold text-gray-900">Trip Types</h1>
          <p className="text-gray-600">Manage categories for your travel packages</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trip Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trip types..."
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
                  <th className="text-left p-4">Icon</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Loading trip types...
                    </td>
                  </tr>
                ) : filteredTripTypes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No trip types found.
                    </td>
                  </tr>
                ) : (
                  filteredTripTypes.map((type) => (
                    <tr key={type._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {type.iconUrl && (
                          <Image
                            src={type.iconUrl || "/placeholder.svg"}
                            alt={type.name}
                            width={32}
                            height={32}
                            className="rounded-md object-cover"
                          />
                        )}
                      </td>
                      <td className="p-4 font-medium">{type.name}</td>
                      <td className="p-4 text-gray-600">{type.description}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(type)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(type._id)}
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
