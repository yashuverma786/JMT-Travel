"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdmin } from "@/components/admin/admin-context"
import {
  MapPin,
  Plane,
  Activity,
  Star,
  FileText,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react"

export default function AdminDashboard() {
  const { destinations, trips, activities, reviews, blogs, collaborators, leads } = useAdmin()

  const stats = [
    {
      title: "Total Destinations",
      value: destinations.length,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Trips",
      value: trips.filter((trip) => trip.status === "active").length,
      icon: Plane,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Activities",
      value: activities.length,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Reviews",
      value: reviews.filter((review) => review.status === "pending").length,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Published Blogs",
      value: blogs.filter((blog) => blog.status === "published").length,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Team Members",
      value: collaborators.length,
      icon: UserCheck,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "New Leads",
      value: leads.filter((lead) => lead.status === "new").length,
      icon: MessageSquare,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Revenue",
      value: "₹2.5L",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  const recentActivities = [
    { action: "New trip booking", details: "Goa Beach Paradise - John Doe", time: "2 hours ago" },
    { action: "Review submitted", details: "Kerala Backwaters - 5 stars", time: "4 hours ago" },
    { action: "New blog published", details: "Top 10 Beaches in Goa", time: "6 hours ago" },
    { action: "Lead generated", details: "Rajasthan Tour inquiry", time: "8 hours ago" },
    { action: "Trip updated", details: "Himachal Adventure package", time: "1 day ago" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your travel business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Plane className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Add New Trip</p>
                <p className="text-sm text-gray-600">Create travel package</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <MapPin className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Add Destination</p>
                <p className="text-sm text-gray-600">New travel location</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Write Blog</p>
                <p className="text-sm text-gray-600">Create new article</p>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
                <Star className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="font-medium text-gray-900">Review Feedback</p>
                <p className="text-sm text-gray-600">Manage reviews</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
