"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Check, X, Clock, Building, MapPin, Star } from "lucide-react"

interface Listing {
  id: string
  type: "hotel" | "trip" | "activity" | "restaurant"
  title: string
  description: string
  location: string
  submittedBy: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  price?: number
  rating?: number
  images: string[]
  details: any
}

export default function DistributionPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/admin/distribution/listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/distribution/listings/${id}/approve`, {
        method: "POST",
      })
      if (response.ok) {
        setListings(listings.map((listing) => (listing.id === id ? { ...listing, status: "approved" } : listing)))
      }
    } catch (error) {
      console.error("Error approving listing:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/distribution/listings/${id}/reject`, {
        method: "POST",
      })
      if (response.ok) {
        setListings(listings.map((listing) => (listing.id === id ? { ...listing, status: "rejected" } : listing)))
      }
    } catch (error) {
      console.error("Error rejecting listing:", error)
    }
  }

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = activeTab === "all" || listing.status === activeTab

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return <Building className="w-4 h-4" />
      case "trip":
        return <MapPin className="w-4 h-4" />
      case "activity":
        return <Star className="w-4 h-4" />
      default:
        return <Building className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distribution Management</h1>
          <p className="text-gray-600">Review and approve partner submissions</p>
        </div>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                <Clock className="w-4 h-4 mr-2" />
                Pending ({listings.filter((l) => l.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                <Check className="w-4 h-4 mr-2" />
                Approved ({listings.filter((l) => l.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                <X className="w-4 h-4 mr-2" />
                Rejected ({listings.filter((l) => l.status === "rejected").length})
              </TabsTrigger>
              <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(listing.status)} text-white`}>
                        {listing.status}
                      </Badge>
                      <Badge className="absolute top-2 left-2 bg-white text-gray-800">
                        {getTypeIcon(listing.type)}
                        <span className="ml-1 capitalize">{listing.type}</span>
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{listing.title}</h3>
                      <p className="text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{listing.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500">By: {listing.submittedBy}</div>
                        {listing.price && (
                          <div className="font-semibold text-blue-600">₹{listing.price.toLocaleString()}</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedListing(listing)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {listing.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(listing.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(listing.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Listing Detail Modal would go here */}
    </div>
  )
}
