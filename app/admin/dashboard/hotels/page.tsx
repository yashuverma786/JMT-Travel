"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { FileUpload } from "@/components/ui/file-upload"
import { useAdmin } from "@/components/admin/admin-context" // To check user role/permissions
import { PERMISSIONS } from "@/lib/permissions"

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
  status: "pending_approval" | "approved" | "rejected" // Updated status
  ownerId?: string
}

export default function HotelsAdminPage() {
  const { user } = useAdmin() // Get current admin user
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState<Omit<Hotel, "_id" | "ownerId" | "status">>({
    // Status will be set by backend or approval
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
  })
  const [loading, setLoading] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [currentAmenity, setCurrentAmenity] = useState("")

  const canApproveListings = user?.permissions?.includes(PERMISSIONS.APPROVE_LISTINGS)
  const isHotelLister = user?.role === "hotel_lister"

  useEffect(() => {
    fetchHotels()
  }, [user]) // Re-fetch if user changes, for hotel_lister view

  const fetchHotels = async () => {
    setLoading(true)
    try {
      // Hotel listers might have a different endpoint or query param to fetch only their hotels
      const apiUrl = isHotelLister ? `/api/admin/hotels?ownerId=${user?._id}` : "/api/admin/hotels"
      const response = await fetch(apiUrl) // Adjust API if hotel_lister should only see their own
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
    // Hotel lister should only edit their own hotels and not change status
    if (isHotelLister && hotel.ownerId !== user?._id) {
      alert("You can only edit your own hotel listings.")
      return
    }
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
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string, ownerId?: string) => {
    if (isHotelLister && ownerId !== user?._id) {
      alert("You can only delete your own hotel listings.")
      return
    }
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

    const payload = { ...formData } as any
    if (!editingHotel && isHotelLister && user?._id) {
      payload.ownerId = user._id // Set ownerId for new listings by hotel_lister
      payload.status = "pending_approval" // New listings by hotel_lister are pending
    }

    try {
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
    if (!canApproveListings) {
      alert("You do not have permission to approve listings.")
      return
    }
    try {
      const response = await fetch(`/api/admin/hotels/${hotelId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchHotels() // Refresh list
      } else {
        alert("Failed to update hotel status.")
      }
    } catch (error) {
      console.error("Error updating hotel status:", error)
      alert("An error occurred while updating hotel status.")
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
              <div>
                <Label>Hotel Images</Label>
                <FileUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                  multiple={true}
                  label="Upload hotel images"
                />
              </div>
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
              {/* Status field is removed from direct editing by hotel_lister or general admin, handled by approval flow */}
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isHotelLister ? "My Hotel Listings" : "Hotels Management"}
          </h1>
          <p className="text-gray-600">
            {isHotelLister ? "Manage your hotel listings" : "Manage all hotel listings for the website"}
          </p>
        </div>
        {(user?.permissions?.includes(PERMISSIONS.MANAGE_HOTELS) ||
          user?.permissions?.includes(PERMISSIONS.MANAGE_OWN_HOTELS)) && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Hotel
          </Button>
        )}
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
                            hotel.status === "approved"
                              ? "default" // 'default' for green-like
                              : hotel.status === "pending_approval"
                                ? "outline" // 'outline' for yellow-like
                                : "destructive" // 'destructive' for red
                          }
                          className={
                            hotel.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : hotel.status === "pending_approval"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {hotel.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {(user?.permissions?.includes(PERMISSIONS.MANAGE_HOTELS) ||
                            (isHotelLister && hotel.ownerId === user?._id)) && (
                            <Button size="sm" variant="outline" onClick={() => handleEdit(hotel)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {(user?.permissions?.includes(PERMISSIONS.MANAGE_HOTELS) ||
                            (isHotelLister && hotel.ownerId === user?._id)) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(hotel._id, hotel.ownerId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          {canApproveListings && hotel.status === "pending_approval" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApproval(hotel._id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(hotel._id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
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
