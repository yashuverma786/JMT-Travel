"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Listing {
  _id: string
  title: string
  partnerId: string // Assuming this is a string ID for display, ObjectId in backend
  type: string // e.g., "hotel", "tour", "activity", "restaurant"
  description: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  updatedAt: string
}

export default function DistributionPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState<Omit<Listing, "_id" | "submittedAt" | "updatedAt">>({
    title: "",
    partnerId: "",
    type: "",
    description: "",
    imageUrl: "",
    status: "pending",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/distribution/listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.partnerId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing)
    setFormData({
      title: listing.title,
      partnerId: listing.partnerId,
      type: listing.type,
      description: listing.description,
      imageUrl: listing.imageUrl,
      status: listing.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch(`/api/admin/distribution/listings/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setListings(listings.filter((l) => l._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete listing.")
        }
      } catch (error) {
        console.error("Error deleting listing:", error)
        alert("An error occurred while deleting the listing.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingListing
        ? `/api/admin/distribution/listings/${editingListing._id}`
        : "/api/admin/distribution/listings"
      const method = editingListing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchListings() // Re-fetch all listings to update the list
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save listing.")
      }
    } catch (error) {
      console.error("Error saving listing:", error)
      alert("An error occurred while saving the listing.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingListing(null)
    setFormData({
      title: "",
      partnerId: "",
      type: "",
      description: "",
      imageUrl: "",
      status: "pending",
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
            <h1 className="text-3xl font-bold text-gray-900">{editingListing ? "Edit Listing" : "Add New Listing"}</h1>
            <p className="text-gray-600">Manage partner submissions and external content</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Grand Hyatt Goa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="partnerId">Partner ID</Label>
                <Input
                  id="partnerId"
                  value={formData.partnerId}
                  onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                  placeholder="Enter Partner ID (e.g., from Collaborators)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the listing"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/listing-image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "pending" | "approved" | "rejected") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingListing ? "Update Listing" : "Create Listing"}
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
          <h1 className="text-3xl font-bold text-gray-900">Distribution Listings</h1>
          <p className="text-gray-600">Manage and approve listings submitted by partners</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listings..."
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
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Partner ID</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Submitted At</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading listings...
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing) => (
                    <tr key={listing._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={listing.imageUrl || "/placeholder.svg"}
                          alt={listing.title}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{listing.title}</td>
                      <td className="p-4 text-gray-600">{listing.partnerId}</td>
                      <td className="p-4 text-gray-600">{listing.type}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : listing.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(listing.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(listing)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(listing._id)}
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
