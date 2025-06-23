"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface FAQItem {
  question: string
  answer: string
}

interface ItineraryItem {
  day: number
  title: string
  description: string
}

interface Trip {
  _id: string
  title: string
  destination: string // Could be an ID linking to Destinations collection
  tripType: string // Could be an ID linking to TripTypes collection
  durationDays: number
  durationNights: number
  priceAdult: number
  priceChild?: number
  originalPriceAdult?: number
  discount?: number // Percentage
  minPax?: number
  maxPax?: number
  trending: boolean
  overview: string
  itinerary: ItineraryItem[]
  inclusions: string[]
  exclusions: string[]
  tripInfo?: {
    transport?: string
    meals?: string
    accommodation?: string
  }
  mapEmbed?: string // Iframe code for map
  faqs: FAQItem[]
  imageUrls: string[] // Multiple image URLs
  status: "active" | "inactive" | "draft"
}

const initialFormData: Omit<Trip, "_id"> = {
  title: "",
  destination: "",
  tripType: "",
  durationDays: 0,
  durationNights: 0,
  priceAdult: 0,
  priceChild: undefined,
  originalPriceAdult: undefined,
  discount: undefined,
  minPax: undefined,
  maxPax: undefined,
  trending: false,
  overview: "",
  itinerary: [],
  inclusions: [],
  exclusions: [],
  tripInfo: {},
  mapEmbed: "",
  faqs: [],
  imageUrls: [],
  status: "draft",
}

export default function TripsAdminPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [formData, setFormData] = useState<Omit<Trip, "_id">>(initialFormData)
  const [loading, setLoading] = useState(false)

  // States for managing dynamic array inputs in the form
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [currentInclusion, setCurrentInclusion] = useState("")
  const [currentExclusion, setCurrentExclusion] = useState("")
  const [currentFaq, setCurrentFaq] = useState<FAQItem>({ question: "", answer: "" })

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/trips")
      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    // Ensure all fields, especially arrays, are correctly initialized from the trip data
    setFormData({
      title: trip.title || "",
      destination: trip.destination || "",
      tripType: trip.tripType || "",
      durationDays: trip.durationDays || 0,
      durationNights: trip.durationNights || 0,
      priceAdult: trip.priceAdult || 0,
      priceChild: trip.priceChild,
      originalPriceAdult: trip.originalPriceAdult,
      discount: trip.discount,
      minPax: trip.minPax,
      maxPax: trip.maxPax,
      trending: trip.trending || false,
      overview: trip.overview || "",
      itinerary: trip.itinerary || [],
      inclusions: trip.inclusions || [],
      exclusions: trip.exclusions || [],
      tripInfo: trip.tripInfo || {},
      mapEmbed: trip.mapEmbed || "",
      faqs: trip.faqs || [],
      imageUrls: trip.imageUrls || [],
      status: trip.status || "draft",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/trips/${id}`, { method: "DELETE" })
        if (response.ok) {
          setTrips(trips.filter((t) => t._id !== id))
        } else {
          alert("Failed to delete trip.")
        }
      } catch (error) {
        console.error("Error deleting trip:", error)
        alert("An error occurred.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const url = editingTrip ? `/api/admin/trips/${editingTrip._id}` : "/api/admin/trips"
    const method = editingTrip ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchTrips()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save trip.")
      }
    } catch (error) {
      console.error("Error saving trip:", error)
      alert("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTrip(null)
    setFormData(initialFormData)
    setCurrentImageUrl("")
    setCurrentInclusion("")
    setCurrentExclusion("")
    setCurrentFaq({ question: "", answer: "" })
  }

  // Helper functions for managing array inputs
  const addToArray = (
    field: keyof Omit<Trip, "_id">,
    value: string,
    resetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (value && !(formData[field] as string[]).includes(value)) {
      setFormData((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), value] }))
      resetter("")
    }
  }
  const removeFromArray = (field: keyof Omit<Trip, "_id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: (prev[field] as string[]).filter((item) => item !== value) }))
  }

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }],
    }))
  }
  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== index) }))
  }
  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string | number) => {
    const updatedItinerary = formData.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData((prev) => ({ ...prev, itinerary: updatedItinerary }))
  }

  const addFaqItem = () => {
    if (currentFaq.question && currentFaq.answer) {
      setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, currentFaq] }))
      setCurrentFaq({ question: "", answer: "" })
    }
  }
  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }))
  }

  if (showForm) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{editingTrip ? "Edit Trip" : "Add New Trip"}</h1>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title (H1)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tripType">Trip Type</Label>
                  <Input
                    id="tripType"
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Trip["status"]) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration & Pax */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="durationDays">Days</Label>
                  <Input
                    type="number"
                    id="durationDays"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="durationNights">Nights</Label>
                  <Input
                    type="number"
                    id="durationNights"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minPax">Min Pax</Label>
                  <Input
                    type="number"
                    id="minPax"
                    value={formData.minPax || ""}
                    onChange={(e) => setFormData({ ...formData, minPax: Number.parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPax">Max Pax</Label>
                  <Input
                    type="number"
                    id="maxPax"
                    value={formData.maxPax || ""}
                    onChange={(e) => setFormData({ ...formData, maxPax: Number.parseInt(e.target.value) || undefined })}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priceAdult">Price Adult (₹)</Label>
                  <Input
                    type="number"
                    id="priceAdult"
                    value={formData.priceAdult}
                    onChange={(e) => setFormData({ ...formData, priceAdult: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priceChild">Price Child (₹)</Label>
                  <Input
                    type="number"
                    id="priceChild"
                    value={formData.priceChild || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, priceChild: Number.parseFloat(e.target.value) || undefined })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="originalPriceAdult">Original Price Adult (₹)</Label>
                  <Input
                    type="number"
                    id="originalPriceAdult"
                    value={formData.originalPriceAdult || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPriceAdult: Number.parseFloat(e.target.value) || undefined })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    type="number"
                    id="discount"
                    value={formData.discount || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: Number.parseFloat(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) => setFormData({ ...formData, trending: Boolean(checked) })}
                />
                <Label htmlFor="trending">Mark as Trending (for Special Offers)</Label>
              </div>

              {/* Overview */}
              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Image URLs */}
              <div>
                <Label>Image URLs (for multiple images)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addToArray("imageUrls", currentImageUrl, setCurrentImageUrl)}
                  >
                    Add Image
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.imageUrls.map((img, idx) => (
                    <div key={idx} className="relative p-1 border rounded">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Trip image ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeFromArray("imageUrls", img)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-2">
                <Label>Itinerary</Label>
                {formData.itinerary.map((item, index) => (
                  <Card key={index} className="p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Day {item.day}</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItineraryDay(index)}>
                        Remove Day
                      </Button>
                    </div>
                    <Input
                      placeholder="Day Title"
                      value={item.title}
                      onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                    />
                    <Textarea
                      placeholder="Day Description"
                      value={item.description}
                      onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                      rows={2}
                    />
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addItineraryDay}>
                  Add Itinerary Day
                </Button>
              </div>

              {/* Inclusions & Exclusions */}
              <div>
                <Label>Inclusions (comma-separated)</Label>
                <Textarea
                  value={formData.inclusions.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inclusions: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Exclusions (comma-separated)</Label>
                <Textarea
                  value={formData.exclusions.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exclusions: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={2}
                />
              </div>

              {/* Trip Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Trip Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label>Transport</Label>
                    <Input
                      value={formData.tripInfo?.transport || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tripInfo: { ...formData.tripInfo, transport: e.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <Label>Meals</Label>
                    <Input
                      value={formData.tripInfo?.meals || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tripInfo: { ...formData.tripInfo, meals: e.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <Label>Accommodation</Label>
                    <Input
                      value={formData.tripInfo?.accommodation || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tripInfo: { ...formData.tripInfo, accommodation: e.target.value } })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Map Embed */}
              <div>
                <Label htmlFor="mapEmbed">Map Embed Code (iframe)</Label>
                <Textarea
                  id="mapEmbed"
                  value={formData.mapEmbed}
                  onChange={(e) => setFormData({ ...formData, mapEmbed: e.target.value })}
                  rows={3}
                  placeholder='<iframe src="..."></iframe>'
                />
              </div>

              {/* FAQs */}
              <div className="space-y-2">
                <Label>FAQs</Label>
                {formData.faqs.map((faq, index) => (
                  <Card key={index} className="p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>FAQ {index + 1}</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                        Remove FAQ
                      </Button>
                    </div>
                    <Input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].question = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                    />
                    <Textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].answer = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      rows={2}
                    />
                  </Card>
                ))}
                <Card className="p-3 space-y-2">
                  <Input
                    placeholder="New FAQ Question"
                    value={currentFaq.question}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  />
                  <Textarea
                    placeholder="New FAQ Answer"
                    value={currentFaq.answer}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                    rows={2}
                  />
                  <Button type="button" variant="outline" onClick={addFaqItem}>
                    Add FAQ Item
                  </Button>
                </Card>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTrip ? "Update Trip" : "Create Trip"}
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Trips Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Trip
        </Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="Search trips by title or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Destination</th>
                <th className="p-3 text-left">Price (Adult)</th>
                <th className="p-3 text-left">Trending</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
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
              {!loading && filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-center">
                    No trips found.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{trip.title}</td>
                    <td className="p-3">{trip.destination}</td>
                    <td className="p-3">₹{trip.priceAdult.toLocaleString()}</td>
                    <td className="p-3">{trip.trending ? "Yes" : "No"}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          trip.status === "active" ? "default" : trip.status === "draft" ? "outline" : "destructive"
                        }
                      >
                        {trip.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(trip._id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
