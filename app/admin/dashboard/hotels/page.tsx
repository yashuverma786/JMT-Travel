"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from "next-auth/react"

interface Hotel {
  _id: string
  name: string
  description: string
  location: string
  price: number
  images: string[]
  amenities: string[]
  status: "pending_approval" | "approved" | "rejected"
  ownerId?: string // To link to the user who listed it
}

const HotelsPage = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.role === "super_admin"

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/admin/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      } else {
        console.error("Failed to fetch hotels")
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleApproval = async (hotelId: string, newStatus: "approved" | "rejected") => {
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
      alert("Error updating hotel status.")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hotels</h1>
      <Table>
        <TableCaption>A list of your recent hotels.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left p-4">Name</TableHead>
            <TableHead className="text-left p-4">Location</TableHead>
            <TableHead className="text-left p-4">Price</TableHead>
            {isSuperAdmin && <TableHead className="text-left p-4">Status</TableHead>}
            {isSuperAdmin && <TableHead className="text-left p-4">Approval Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel._id}>
              <TableCell className="font-medium p-4">{hotel.name}</TableCell>
              <TableCell className="p-4">{hotel.location}</TableCell>
              <TableCell className="p-4">{hotel.price}</TableCell>
              {isSuperAdmin && <TableCell className="p-4">{hotel.status}</TableCell>}
              {isSuperAdmin && hotel.status === "pending_approval" && (
                <TableCell className="p-4">
                  <Button
                    size="sm"
                    onClick={() => handleApproval(hotel._id, "approved")}
                    className="mr-2 bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleApproval(hotel._id, "rejected")}>
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default HotelsPage
