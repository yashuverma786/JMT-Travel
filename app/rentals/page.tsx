// Placeholder for Car Rentals/Transfers Frontend Listing Page
"use client"
import { Car } from "lucide-react"

export default function RentalsListingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12 bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <div className="container text-center">
          <Car className="mx-auto h-12 w-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold">Rent a Car or Book a Transfer</h1>
          <p className="text-xl mt-2 opacity-90">Find reliable and affordable transportation options.</p>
        </div>
      </section>
      <section className="container py-8">
        <p className="text-center text-gray-700 text-lg p-8 bg-white rounded-lg shadow-md">
          The Car Rentals and Transfers listing page is under construction. It will feature search, filters, and
          detailed listings for various vehicles.
        </p>
      </section>
    </div>
  )
}
