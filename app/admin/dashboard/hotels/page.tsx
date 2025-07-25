"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { FileUpload } from "@/components/ui/file-upload"
import { useAdmin } from "@/components/admin/admin-context"
import { PERMISSIONS } from "@/lib/permissions"

interface Hotel {
  _id: string
  name: string
  location: string
  pricePerNight: number
  description: string
  images: string[]
  amenities: string[]
  status: "pending" | "approved" | "rejected"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function HotelsAdminPage() {
  const { user } = useAdmin()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pricePerNight: "",
    description: "",
    images: [] as string[],
    amenities: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [amenityInput, setAmenityInput] = useState("")

  const canApprove = user?.permissions?.includes(PERMISSIONS.APPROVE_LISTINGS)
  const canManageHotels =
    user?.permissions?.includes(PERMISSIONS.MANAGE_HOTELS) || user?.permissions?.includes(PERMISSIONS.MANAGE_OWN_HOTELS)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(data.hotels)
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight.toString(),
      description: hotel.description,
      images: hotel.images || [],
      amenities: hotel.amenities || [],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      try {
        const response = await fetch(`/api/admin/hotels/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setHotels(hotels.filter((h) => h._id !== id))
        } else {
          alert("Failed to delete hotel.")
        }
      } catch (error) {
        console.error("Error deleting hotel:", error)
        alert("An error occurred.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingHotel ? `/api/admin/hotels/${editingHotel._id}` : "/api/admin/hotels"
      const method = editingHotel ? "PUT" : "POST"

      const payload = {
        ...formData,
        pricePerNight: Number.parseFloat(formData.pricePerNight),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchHotels()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save hotel.")
      }
    } catch (error) {
      console.error("Error saving hotel:", error)
      alert("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (hotelId: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/admin/hotels/${hotelId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchHotels()
      } else {
        alert("Failed to update hotel status.")
      }
    } catch (error) {
      console.error("Error updating hotel status:", error)
      alert("An error occurred.")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingHotel(null)
    setFormData({
      name: "",
      location: "",
      pricePerNight: "",
      description: "",
      images: [],
      amenities: [],
    })
    setAmenityInput("")
  }

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      })
      setAmenityInput("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
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
            <h1 className="text-3xl font-bold text-gray-900">{editingHotel ? "Edit Hotel" : "Add New Hotel"}</h1>
            <p className="text-gray-600">Manage hotel listings</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Hotel Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grand Palace Hotel"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mumbai, Maharashtra"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hotel description..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricePerNight">Price Per Night (₹)</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                  placeholder="e.g., 5000"
                  required
                  min="0"
                />
              </div>

              <div>
                <FileUpload
                  label="Hotel Images"
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                  multiple={true}
                />
              </div>

              <div>
                <Label htmlFor="amenities">Amenities</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="amenities"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g., WiFi, Pool, Gym"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0"
                        onClick={() => removeAmenity(amenity)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingHotel ? "Update Hotel" : "Create Hotel"}
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
          <h1 className="text-3xl font-bold text-gray-900">Hotels Management</h1>
          <p className="text-gray-600">Manage hotel listings for your website</p>
        </div>
        {canManageHotels && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
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
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Price/Night</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading hotels...
                    </td>
                  </tr>
                ) : filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No hotels found.
                    </td>
                  </tr>
                ) : (
                  filteredHotels.map((hotel) => (
                    <tr key={hotel._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={hotel.images[0] || "/placeholder.svg?text=Hotel"}
                          alt={hotel.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{hotel.name}</td>
                      <td className="p-4 text-gray-600">{hotel.location}</td>
                      <td className="p-4 text-gray-600">₹{hotel.pricePerNight.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            hotel.status === "approved"
                              ? "default"
                              : hotel.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {hotel.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {canManageHotels && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(hotel)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(hotel._id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {canApprove && hotel.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApproval(hotel._id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(hotel._id, "rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
