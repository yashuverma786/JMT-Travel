"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Check, X, Eye } from "lucide-react"

interface Review {
  id: string
  customerName: string
  tripName: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  date: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "John Doe",
      tripName: "Goa Beach Paradise",
      rating: 5,
      comment: "Amazing trip! The beaches were beautiful and the service was excellent.",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      tripName: "Kerala Backwaters",
      rating: 4,
      comment: "Great experience with wonderful scenery. Highly recommended!",
      status: "approved",
      date: "2024-01-14",
    },
    {
      id: "3",
      customerName: "Mike Johnson",
      tripName: "Rajasthan Royal Tour",
      rating: 3,
      comment: "Good trip but could be better organized.",
      status: "approved",
      date: "2024-01-13",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tripName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, status: "approved" as const } : review)))
  }

  const handleReject = (id: string) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, status: "rejected" as const } : review)))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage customer reviews and ratings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{review.customerName}</h3>
                    <p className="text-gray-600">{review.tripName}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <Badge
                      className={`${
                        review.status === "approved"
                          ? "bg-green-500"
                          : review.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {review.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {review.status !== "pending" && (
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
