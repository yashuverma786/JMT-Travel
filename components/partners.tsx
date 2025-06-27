"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Partners() {
  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(true)

  // Fallback static partners
  const staticPartners = [
    { name: "TripAdvisor", logo: "/placeholder.svg?text=TripAdvisor" },
    { name: "Booking.com", logo: "/placeholder.svg?text=Booking" },
    { name: "Expedia", logo: "/placeholder.svg?text=Expedia" },
    { name: "Agoda", logo: "/placeholder.svg?text=Agoda" },
    { name: "Hotels.com", logo: "/placeholder.svg?text=Hotels" },
    { name: "Airbnb", logo: "/placeholder.svg?text=Airbnb" },
  ]

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await fetch("/api/collaborators")
        if (response.ok) {
          const data = await response.json()
          setCollaborators(data.collaborators || [])
        }
      } catch (error) {
        console.error("Failed to fetch collaborators:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborators()
  }, [])

  const displayPartners = collaborators.length > 0 ? collaborators : staticPartners

  return (
    <section className="py-16 bg-gray-100">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Global Recognitions</h2>
          <p className="text-lg text-gray-600">Trusted by leading travel platforms worldwide</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-16 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {displayPartners.map((partner: any, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={partner.logo || partner.logoUrl}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
