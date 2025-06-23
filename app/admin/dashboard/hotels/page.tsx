"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface Hotel {
  _id: string
  name: string
  description: string
  address: string
  city: string
  country: string
  contactPhone?: string
  contactEmail?: string
  images: string[]
  amenities: string[]
  starRating?: number
  pricePerNight?: number
  status: "published" | "pending" | "rejected"
  ownerId?: string // To link to a hotel owner user
}

export default function HotelsAdminPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState<Omit<Hotel, "_id" | "ownerId">>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    contactPhone: "",
    contactEmail: "",
    images: [],
    amenities: [],
    starRating: undefined,
    pricePerNight: undefined,
    status: "published",
  })
  const [loading, setLoading] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [currentAmenity, setCurrentAmenity] = useState("")

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
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      contactPhone: hotel.contactPhone || "",
      contactEmail: hotel.contactEmail || "",
      images: hotel.images || [],
      amenities: hotel.amenities || [],
      starRating: hotel.starRating,
      pricePerNight: hotel.pricePerNight,
      status: hotel.status,
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
    const url = editingHotel ? `/api/admin/hotels/${editingHotel._id}` : "/api/admin/hotels"
    const method = editingHotel ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  const handleCancel = () => {
    setShowForm(false)
    setEditingHotel(null)
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      contactPhone: "",
      contactEmail: "",
      images: [],
      amenities: [],
      starRating: undefined,
      pricePerNight: undefined,
      status: "published",
    })
    setCurrentImageUrl("")
    setCurrentAmenity("")
  }

  const addImage = () => {
    if (currentImageUrl && !formData.images.includes(currentImageUrl)) {
      setFormData({ ...formData, images: [...formData.images, currentImageUrl] })
      setCurrentImageUrl("")
    }
  }
  const removeImage = (imgUrl: string) => {
    setFormData({ ...formData, images: formData.images.filter((img) => img !== imgUrl) })
  }

  const addAmenity = () => {
    if (currentAmenity && !formData.amenities.includes(currentAmenity)) {
      setFormData({ ...formData, amenities: [...formData.amenities, currentAmenity] })
      setCurrentAmenity("")
    }
  }
  const removeAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities.filter((item) => item !== amenity) })
  }

  if (showForm) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {editingHotel ? "Edit Hotel" : "Add New Hotel"}
            </h1>
            <p className="text-gray-600">Manage hotel listings</p>
          </div>
        </div>
        <Card className="max-w-3xl">
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="starRating">Star Rating (1-5)</Label>
                  <Input
                    id="starRating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.starRating || ""}
                    onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) || undefined })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone || ""}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail || ""}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pricePerNight">Price Per Night (₹)</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  value={formData.pricePerNight || ""}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) || undefined })}
                />
              </div>

              {/* Image URLs */}
              <div>
                <Label htmlFor="imageUrl">Image URLs</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="imageUrl"
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    Add Image
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative p-1 border rounded">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Hotel image ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(img)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Label htmlFor="amenity">Amenities</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="amenity"
                    value={currentAmenity}
                    onChange={(e) => setCurrentAmenity(e.target.value)}
                    placeholder="e.g., WiFi, Pool"
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    Add Amenity
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 text-xs"
                        onClick={() => removeAmenity(item)}
                      >
                        X
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Hotel["status"] })}
                  className="w-full p-2 border rounded"
                >
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hotels Management</h1>
          <p className="text-gray-600">Manage hotel listings for the website</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Hotel
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Price/Night</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && filteredHotels.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center">
                      No hotels found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredHotels.map((hotel) => (
                    <tr key={hotel._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={hotel.images[0] || "/placeholder.svg?text=Hotel"}
                            alt={hotel.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <span className="font-medium">{hotel.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {hotel.city}, {hotel.country}
                      </td>
                      <td className="p-3 text-gray-600">{hotel.starRating ? `${hotel.starRating} Star` : "N/A"}</td>
                      <td className="p-3 text-gray-600">
                        {hotel.pricePerNight ? `₹${hotel.pricePerNight.toLocaleString()}` : "N/A"}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            hotel.status === "published"
                              ? "default"
                              : hotel.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {hotel.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(hotel)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(hotel._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
