"use client"

import Link from "next/link"

import { CardDescription } from "@/components/ui/card"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/components/admin/admin-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Plane, Star, Newspaper, HotelIcon } from "lucide-react"

const managementCards = [
  {
    title: "Destinations",
    description: "Manage travel destinations",
    icon: MapPin,
    href: "/admin/dashboard/destinations",
    color: "text-blue-600",
  },
  {
    title: "Trips",
    description: "Manage trip packages",
    icon: Plane,
    href: "/admin/dashboard/trips",
    color: "text-green-600",
  },
  {
    title: "Trip Types",
    description: "Manage trip categories",
    icon: Plane,
    href: "/admin/dashboard/trip-types",
    color: "text-purple-600",
  },
  {
    title: "Activities",
    description: "Manage activities",
    icon: Plane,
    href: "/admin/dashboard/activities",
    color: "text-orange-600",
  },
  {
    title: "Hotels",
    description: "Manage hotel listings",
    icon: HotelIcon,
    href: "/admin/dashboard/hotels",
    color: "text-red-600",
  },
  {
    title: "Car Rentals",
    description: "Manage vehicle rentals",
    icon: Plane,
    href: "/admin/dashboard/rentals",
    color: "text-indigo-600",
  },
  {
    title: "Blogs",
    description: "Manage blog posts",
    icon: Newspaper,
    href: "/admin/dashboard/blogs",
    color: "text-teal-600",
  },
  {
    title: "Reviews",
    description: "Manage customer reviews",
    icon: Star,
    href: "/admin/dashboard/reviews",
    color: "text-pink-600",
  },
  {
    title: "Users",
    description: "Manage user accounts",
    icon: Users,
    href: "/admin/dashboard/users",
    color: "text-gray-600",
  },
  {
    title: "Collaborators",
    description: "Manage partners & vendors",
    icon: Plane,
    href: "/admin/dashboard/collaborators",
    color: "text-yellow-600",
  },
  {
    title: "Leads",
    description: "Manage customer inquiries",
    icon: Plane,
    href: "/admin/dashboard/leads",
    color: "text-cyan-600",
  },
  {
    title: "Custom Requests",
    description: "Manage tour requests",
    icon: Plane,
    href: "/admin/dashboard/custom-requests",
    color: "text-emerald-600",
  },
]

export default function AdminDashboardPage() {
  const { user } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === "hotel_lister" && !user.permissions.includes("manage_own_hotels")) {
      // If hotel_lister somehow lands here without the specific permission,
      // redirect to a more appropriate page or show a restricted message.
      // This is a fallback, primary redirection should happen in layout or a wrapper.
      // For now, we assume they have MANAGE_OWN_HOTELS and will see the Hotels tab.
      // A dedicated /admin/dashboard/my-hotels page would be better.
    } else if (user && user.role === "hotel_lister") {
      // If they are a hotel lister, they should ideally be redirected to their specific hotel management page
      // For now, they will see the main dashboard but sidebar links will be restricted.
      // Consider redirecting to /admin/dashboard/hotels if that's their primary view.
      // router.replace("/admin/dashboard/hotels"); // Example redirect
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading user data...</p>
      </div>
    )
  }

  // Example stats - replace with actual data fetching
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "text-blue-500" },
    { title: "Destinations", value: "56", icon: MapPin, color: "text-green-500" },
    { title: "Trips", value: "120", icon: Plane, color: "text-purple-500" },
    { title: "Hotels", value: "78", icon: HotelIcon, color: "text-orange-500" },
    { title: "Reviews", value: "500+", icon: Star, color: "text-yellow-500" },
    { title: "Blog Posts", value: "30", icon: Newspaper, color: "text-indigo-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.username}! Here's an overview of your site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managementCards.map((card) => {
          const IconComponent = card.icon
          return (
            <Card key={card.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-6 w-6 ${card.color}`} />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={card.href}>
                  <button className="w-full">Manage</button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add more sections like recent activity, charts, etc. */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Placeholder)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to display yet.</p>
          {/* Example: <BarChart className="w-full h-64" /> */}
        </CardContent>
      </Card>
    </div>
  )
}
