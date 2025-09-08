"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Clock, MapPin, Wallet, Settings, Search, Filter } from "lucide-react"

export default function FilterBar() {
  const [filters, setFilters] = useState({
    tripType: "",
    duration: "",
    destination: "",
    budget: "",
    activity: "",
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
    // Implement search logic here
  }

  return (
    <section className="bg-white shadow-lg rounded-lg mx-4 -mt-8 relative z-30" aria-label="Search filters">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 border-b">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 min-h-[44px] text-base"
          aria-expanded={isExpanded}
          aria-controls="filter-content"
        >
          <Filter className="h-4 w-4" />
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Content */}
      <div
        id="filter-content"
        className={`p-4 transition-all duration-300 ease-in-out ${isExpanded ? "block" : "hidden md:block"}`}
      >
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 min-w-0">
            <Select onValueChange={(value) => handleFilterChange("tripType", value)}>
              <SelectTrigger className="h-12 border-gray-200 hover:border-blue-300 transition-colors text-base min-h-[44px] z-20">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="Trip Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="honeymoon">Honeymoon</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <Select onValueChange={(value) => handleFilterChange("duration", value)}>
              <SelectTrigger className="h-12 border-gray-200 hover:border-blue-300 transition-colors text-base min-h-[44px] z-20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="0 Days - 11 Days" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="1-2">1-2 Days</SelectItem>
                <SelectItem value="3-5">3-5 Days</SelectItem>
                <SelectItem value="6-8">6-8 Days</SelectItem>
                <SelectItem value="9-11">9-11 Days</SelectItem>
                <SelectItem value="12+">12+ Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <Select onValueChange={(value) => handleFilterChange("destination", value)}>
              <SelectTrigger className="h-12 border-gray-200 hover:border-blue-300 transition-colors text-base min-h-[44px] z-20">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="Destination" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="goa">Goa</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="himachal">Himachal Pradesh</SelectItem>
                <SelectItem value="kashmir">Kashmir</SelectItem>
                <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <Select onValueChange={(value) => handleFilterChange("budget", value)}>
              <SelectTrigger className="h-12 border-gray-200 hover:border-blue-300 transition-colors text-base min-h-[44px] z-20">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="₹0 - ₹27,350" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
                <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                <SelectItem value="30000+">₹30,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <Select onValueChange={(value) => handleFilterChange("activity", value)}>
              <SelectTrigger className="h-12 border-gray-200 hover:border-blue-300 transition-colors text-base min-h-[44px] z-20">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="Activity" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="water-sports">Water Sports</SelectItem>
                <SelectItem value="trekking">Trekking</SelectItem>
                <SelectItem value="wildlife">Wildlife Safari</SelectItem>
                <SelectItem value="cultural">Cultural Tours</SelectItem>
                <SelectItem value="adventure">Adventure Sports</SelectItem>
                <SelectItem value="wellness">Wellness & Spa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 md:px-8 py-3 h-12 font-medium text-base min-h-[44px] min-w-[120px] z-10"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </section>
  )
}
