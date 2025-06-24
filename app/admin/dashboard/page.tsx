"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Calendar, Activity, FileText, Star, Building, Car, Settings, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [user] = useState("Trip.jmt")

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/admin"
  }

  const menuItems = [
    { title: "Destinations", icon: MapPin, href: "/admin/dashboard/destinations", count: "12" },
    { title: "Trips", icon: Calendar, href: "/admin/dashboard/trips", count: "45" },
    { title: "Trip Types", icon: Activity, href: "/admin/dashboard/trip-types", count: "8" },
    { title: "Activities", icon: Activity, href: "/admin/dashboard/activities", count: "23" },
    { title: "Hotels", icon: Building, href: "/admin/dashboard/hotels", count: "15" },
    { title: "Car Rentals", icon: Car, href: "/admin/dashboard/rentals", count: "7" },
    { title: "Blogs", icon: FileText, href: "/admin/dashboard/blogs", count: "18" },
    { title: "Reviews", icon: Star, href: "/admin/dashboard/reviews", count: "156" },
    { title: "Users", icon: Users, href: "/admin/dashboard/users", count: "89" },
    { title: "Custom Requests", icon: Settings, href: "/admin/dashboard/custom-requests", count: "5" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JMT Travel Admin</h1>
              <p className="text-sm text-gray-600">Welcome back, {user}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Manage your travel website content and settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <item.icon className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                <CardDescription>Manage {item.title.toLowerCase()}</CardDescription>
                <Button className="w-full mt-3" variant="outline" onClick={() => (window.location.href = item.href)}>
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-16 text-left justify-start"
              variant="outline"
              onClick={() => (window.location.href = "/admin/dashboard/trips")}
            >
              <Calendar className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Add New Trip</div>
                <div className="text-sm text-gray-500">Create a new travel package</div>
              </div>
            </Button>

            <Button
              className="h-16 text-left justify-start"
              variant="outline"
              onClick={() => (window.location.href = "/admin/dashboard/blogs")}
            >
              <FileText className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Write Blog Post</div>
                <div className="text-sm text-gray-500">Share travel insights</div>
              </div>
            </Button>

            <Button
              className="h-16 text-left justify-start"
              variant="outline"
              onClick={() => (window.location.href = "/admin/dashboard/custom-requests")}
            >
              <Settings className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Review Requests</div>
                <div className="text-sm text-gray-500">Check custom tour requests</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
