"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, SearchIcon } from "lucide-react"

interface Transfer {
  _id: string
  type: string
  price: number
  description: string
  images: string[]
  status: string
}

export default function TransfersListingPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "all-types",
    minPrice: "",
    maxPrice: "",
  })

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/transfers")
        if (response.ok) {
          const data = await response.json()
          setTransfers(data.transfers.filter((transfer: any) => transfer.status === "approved"))
        }
      } catch (error) {
        console.error("Failed to fetch transfers:", error)
      }
      setLoading(false)
    }
    fetchTransfers()
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filteredTransfers = transfers.filter((transfer) => {
    return (
      (transfer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.type !== "all-types" ? transfer.type.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
      (filters.minPrice ? transfer.price >= Number.parseFloat(filters.minPrice) : true) &&
      (filters.maxPrice ? transfer.price <= Number.parseFloat(filters.maxPrice) : true)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container text-center">
          <Car className="mx-auto h-12 w-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold">Book Your Transfer</h1>
          <p className="text-xl mt-2 opacity-90">Reliable and comfortable transfer services.</p>
        </div>
      </section>

      <section className="container py-8">
        <Card className="mb-8 p-4 md:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="searchTerm" className="text-sm font-medium">
                Search Transfer Type
              </Label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="searchTerm"
                  placeholder="e.g., Airport Pickup, City Transfer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="typeFilter" className="text-sm font-medium">
                Filter by Type
              </Label>
              <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="airport-pickup">Airport Pickup</SelectItem>
                  <SelectItem value="airport-drop">Airport Drop</SelectItem>
                  <SelectItem value="city-transfer">City Transfer</SelectItem>
                  <SelectItem value="intercity">Intercity Transfer</SelectItem>
                  <SelectItem value="car-rental">Car Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minPrice" className="text-sm font-medium">
                Min Price (₹)
              </Label>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm font-medium">
                Max Price (₹)
              </Label>
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="Any"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-10">Loading transfers...</div>
        ) : filteredTransfers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No transfers found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransfers.map((transfer) => (
              <Card key={transfer._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <Link href={`/transfers/${transfer._id}`} className="block">
                  <div className="relative h-56 w-full">
                    <Image
                      src={transfer.images[0] || "/placeholder.svg?text=Transfer+Service"}
                      alt={transfer.type}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {transfer.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{transfer.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-700">₹{transfer.price.toLocaleString()}</div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
