"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface CustomTourRequest {
  _id: string
  fullName: string
  email: string
  phone: string
  destination: string
  tripType: string
  departureDate?: string
  duration?: string
  adults: number
  children?: number
  accommodation?: string
  transportation?: string
  budget?: string
  activities?: string[]
  specialRequests?: string
  status: "pending" | "reviewed" | "converted" | "rejected"
  createdAt: string
}

export default function CustomTourRequestsPage() {
  const [requests, setRequests] = useState<CustomTourRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CustomTourRequest | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      // Assume an API endpoint /api/admin/custom-requests exists
      const response = await fetch("/api/admin/custom-requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      }
    } catch (error) {
      console.error("Error fetching custom tour requests:", error)
    }
    setLoading(false)
  }

  const updateRequestStatus = async (id: string, status: CustomTourRequest["status"]) => {
    try {
      // Assume an API endpoint /api/admin/custom-requests/[id] for PUT
      const response = await fetch(`/api/admin/custom-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchRequests() // Refresh list
      } else {
        alert("Failed to update status.")
      }
    } catch (error) {
      alert("Error updating status.")
    }
  }

  const convertToTrip = (request: CustomTourRequest) => {
    // This would navigate to the "Add Trip" page, pre-filling data
    // For simplicity, we'll just log it and update status
    console.log("Converting to trip:", request)
    // You'd typically use query params or state management to pass data
    // router.push(`/admin/dashboard/trips?fromRequest=${request._id}`);
    alert(`Request from ${request.fullName} for ${request.destination} would be pre-filled in the 'Add Trip' form.`)
    updateRequestStatus(request._id, "converted")
  }

  if (loading) return <div className="p-6 text-center">Loading custom tour requests...</div>

  if (selectedRequest) {
    return (
      <div className="p-6 space-y-4">
        <Button onClick={() => setSelectedRequest(null)} variant="outline">
          ← Back to List
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Request from: {selectedRequest.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRequest.phone}
            </p>
            <p>
              <strong>Destination:</strong> {selectedRequest.destination}
            </p>
            <p>
              <strong>Trip Type:</strong> {selectedRequest.tripType}
            </p>
            <p>
              <strong>Departure:</strong> {selectedRequest.departureDate || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong> {selectedRequest.duration || "N/A"}
            </p>
            <p>
              <strong>Group:</strong> {selectedRequest.adults} Adults, {selectedRequest.children || 0} Children
            </p>
            <p>
              <strong>Accommodation:</strong> {selectedRequest.accommodation || "N/A"}
            </p>
            <p>
              <strong>Transport:</strong> {selectedRequest.transportation || "N/A"}
            </p>
            <p>
              <strong>Budget:</strong> {selectedRequest.budget || "N/A"}
            </p>
            <p>
              <strong>Activities:</strong> {selectedRequest.activities?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Special Requests:</strong> {selectedRequest.specialRequests || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> <Badge>{selectedRequest.status}</Badge>
            </p>
            <p>
              <strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2 pt-4">
              {selectedRequest.status === "pending" && (
                <Button onClick={() => updateRequestStatus(selectedRequest._id, "reviewed")} variant="outline">
                  Mark as Reviewed
                </Button>
              )}
              {(selectedRequest.status === "pending" || selectedRequest.status === "reviewed") && (
                <Button onClick={() => convertToTrip(selectedRequest)} className="bg-green-500 hover:bg-green-600">
                  Convert to Trip Draft
                </Button>
              )}
              {selectedRequest.status !== "rejected" && selectedRequest.status !== "converted" && (
                <Button onClick={() => updateRequestStatus(selectedRequest._id, "rejected")} variant="destructive">
                  Reject
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Custom Tour Requests</h1>
      {requests.length === 0 ? (
        <p>No custom tour requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req._id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {req.destination} by {req.fullName}
                </CardTitle>
                <Badge
                  variant={
                    req.status === "pending"
                      ? "secondary"
                      : req.status === "converted"
                        ? "default"
                        : req.status === "rejected"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {req.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Type: {req.tripType}</p>
                <p className="text-sm text-gray-600">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                <Button onClick={() => setSelectedRequest(req)} className="mt-4 w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
