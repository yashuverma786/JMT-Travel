"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  MapPin,
  Plane,
  Activity,
  Hotel,
  Car,
  FileText,
  MessageSquare,
  UserCheck,
  Mail,
  Settings,
} from "lucide-react"
import Link from "next/link"

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
    icon: Activity,
    href: "/admin/dashboard/trip-types",
    color: "text-purple-600",
  },
  {
    title: "Activities",
    description: "Manage activities",
    icon: Activity,
    href: "/admin/dashboard/activities",
    color: "text-orange-600",
  },
  {
    title: "Hotels",
    description: "Manage hotel listings",
    icon: Hotel,
    href: "/admin/dashboard/hotels",
    color: "text-red-600",
  },
  {
    title: "Car Rentals",
    description: "Manage vehicle rentals",
    icon: Car,
    href: "/admin/dashboard/rentals",
    color: "text-indigo-600",
  },
  {
    title: "Blogs",
    description: "Manage blog posts",
    icon: FileText,
    href: "/admin/dashboard/blogs",
    color: "text-teal-600",
  },
  {
    title: "Reviews",
    description: "Manage customer reviews",
    icon: MessageSquare,
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
    icon: UserCheck,
    href: "/admin/dashboard/collaborators",
    color: "text-yellow-600",
  },
  {
    title: "Leads",
    description: "Manage customer inquiries",
    icon: Mail,
    href: "/admin/dashboard/leads",
    color: "text-cyan-600",
  },
  {
    title: "Custom Requests",
    description: "Manage tour requests",
    icon: Settings,
    href: "/admin/dashboard/custom-requests",
    color: "text-emerald-600",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your travel platform</p>
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
                  <Button className="w-full">Manage</Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
