"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

interface BookingFormProps {
  packageId: string
}

export default function BookingForm({ packageId }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [travelers, setTravelers] = useState("2")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Navigate to booking confirmation page
    router.push(
      `/booking/confirmation?packageId=${packageId}&date=${date ? format(date, "yyyy-MM-dd") : ""}&travelers=${travelers}`,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Departure Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Number of Travelers</label>
        <Select value={travelers} onValueChange={setTravelers}>
          <SelectTrigger>
            <SelectValue placeholder="Select travelers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Traveler</SelectItem>
            <SelectItem value="2">2 Travelers</SelectItem>
            <SelectItem value="3">3 Travelers</SelectItem>
            <SelectItem value="4">4 Travelers</SelectItem>
            <SelectItem value="5">5+ Travelers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input placeholder="Enter your full name" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <Input type="email" placeholder="Enter your email" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <Input type="tel" placeholder="Enter your phone number" required />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Book Now"
        )}
      </Button>
    </form>
  )
}
