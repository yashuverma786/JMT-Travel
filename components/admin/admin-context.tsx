"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PERMISSIONS, type PermissionValue } from "@/lib/permissions" // Assuming PERMISSIONS values are strings

interface AdminUser {
  username: string
  role: string
  permissions: PermissionValue[]
}

interface AdminContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: AdminUser | null
  destinations: any[]
  setDestinations: (destinations: any[]) => void
  tripTypes: any[]
  setTripTypes: (tripTypes: any[]) => void
  activities: any[]
  setActivities: (activities: any[]) => void
  trips: any[]
  setTrips: (trips: any[]) => void
  reviews: any[]
  setReviews: (reviews: any[]) => void
  blogs: any[]
  setBlogs: (blogs: any[]) => void
  collaborators: any[]
  setCollaborators: (collaborators: any[]) => void
  leads: any[]
  setLeads: (leads: any[]) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)

  // Initialize data from localStorage or default values
  const [destinations, setDestinations] = useState([
    {
      id: "1",
      name: "Goa",
      country: "India",
      description: "Beautiful beaches and vibrant nightlife",
      image: "/placeholder.svg?height=200&width=300&text=Goa",
      status: "active",
      trips: 12,
    },
    {
      id: "2",
      name: "Kerala",
      country: "India",
      description: "Backwaters and hill stations",
      image: "/placeholder.svg?height=200&width=300&text=Kerala",
      status: "active",
      trips: 8,
    },
    {
      id: "3",
      name: "Rajasthan",
      country: "India",
      description: "Royal palaces and desert landscapes",
      image: "/placeholder.svg?height=200&width=300&text=Rajasthan",
      status: "active",
      trips: 15,
    },
  ])

  const [tripTypes, setTripTypes] = useState([
    { id: "1", name: "Adventure", description: "Thrilling outdoor activities", status: "active", trips: 25 },
    { id: "2", name: "Cultural", description: "Heritage and cultural experiences", status: "active", trips: 18 },
    { id: "3", name: "Beach", description: "Relaxing beach holidays", status: "active", trips: 12 },
    { id: "4", name: "Wildlife", description: "Safari and nature tours", status: "active", trips: 8 },
  ])

  const [activities, setActivities] = useState([
    {
      id: "1",
      name: "Scuba Diving",
      category: "Water Sports",
      description: "Underwater exploration",
      status: "active",
    },
    { id: "2", name: "Trekking", category: "Adventure", description: "Mountain hiking", status: "active" },
    { id: "3", name: "Cultural Tours", category: "Cultural", description: "Heritage site visits", status: "active" },
    { id: "4", name: "Wildlife Safari", category: "Wildlife", description: "Animal watching", status: "active" },
  ])

  const [trips, setTrips] = useState([
    {
      id: "1",
      title: "Goa Beach Paradise",
      destination: "Goa",
      price: 15999,
      duration: "4 Days 3 Nights",
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Goa+Beach",
      rating: 4.5,
      reviews: 245,
    },
    {
      id: "2",
      title: "Kerala Backwaters",
      destination: "Kerala",
      price: 22999,
      duration: "6 Days 5 Nights",
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Kerala+Backwaters",
      rating: 4.7,
      reviews: 189,
    },
    {
      id: "3",
      title: "Rajasthan Royal Tour",
      destination: "Rajasthan",
      price: 35999,
      duration: "8 Days 7 Nights",
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Rajasthan+Royal",
      rating: 4.6,
      reviews: 312,
    },
  ])

  const [reviews, setReviews] = useState([
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
  ])

  const [blogs, setBlogs] = useState([
    {
      id: "1",
      title: "Top 10 Beaches in Goa",
      author: "Travel Writer",
      status: "published",
      date: "2024-01-15",
      category: "Beach",
      excerpt: "Discover the most beautiful beaches in Goa...",
    },
    {
      id: "2",
      title: "Kerala Backwater Experience",
      author: "Adventure Guide",
      status: "draft",
      date: "2024-01-14",
      category: "Nature",
      excerpt: "Experience the serene backwaters of Kerala...",
    },
  ])

  const [collaborators, setCollaborators] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john@jmttravel.com",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@jmttravel.com",
      role: "Editor",
      status: "active",
      lastLogin: "2024-01-14",
    },
  ])

  const [leads, setLeads] = useState([
    {
      id: "1",
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "+91 9876543210",
      destination: "Goa",
      budget: "15000-25000",
      status: "new",
      date: "2024-01-15",
    },
    {
      id: "2",
      name: "Lisa Brown",
      email: "lisa@example.com",
      phone: "+91 9876543211",
      destination: "Kerala",
      budget: "20000-30000",
      status: "contacted",
      date: "2024-01-14",
    },
  ])

  useEffect(() => {
    const adminUserString = localStorage.getItem("jmt_admin_user") // Corrected key
    if (adminUserString) {
      try {
        const parsedUser = JSON.parse(adminUserString) as AdminUser
        // Ensure permissions is an array, even if not present in older localStorage data
        if (!parsedUser.permissions || !Array.isArray(parsedUser.permissions)) {
          // Fallback logic if permissions are missing (e.g., for older stored data)
          if (parsedUser.role === "admin" || parsedUser.role === "super_admin") {
            parsedUser.permissions = Object.values(PERMISSIONS)
          } else {
            parsedUser.permissions = []
          }
        }
        setUser(parsedUser)
      } catch (e) {
        console.error("Failed to parse admin user from localStorage", e)
        localStorage.removeItem("jmt_admin_user") // Clear corrupted data
      }
    }
  }, [])

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        user,
        destinations,
        setDestinations,
        tripTypes,
        setTripTypes,
        activities,
        setActivities,
        trips,
        setTrips,
        reviews,
        setReviews,
        blogs,
        setBlogs,
        collaborators,
        setCollaborators,
        leads,
        setLeads,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
