"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Plane,
  Activity,
  Star,
  FileText,
  UserCheck,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Destinations", value: "156", icon: MapPin, color: "bg-blue-500" },
    { title: "Active Trips", value: "89", icon: Plane, color: "bg-green-500" },
    { title: "Activities", value: "234", icon: Activity, color: "bg-purple-500" },
    { title: "Reviews", value: "1,247", icon: Star, color: "bg-yellow-500" },
    { title: "Blog Posts", value: "67", icon: FileText, color: "bg-indigo-500" },
    { title: "Collaborators", value: "12", icon: UserCheck, color: "bg-pink-500" },
    { title: "Trip Leads", value: "342", icon: MessageSquare, color: "bg-red-500" },
    { title: "Monthly Revenue", value: "$45,678", icon: DollarSign, color: "bg-emerald-500" },
  ]

  const recentActivities = [
    { action: "New trip added", item: "Goa Beach Paradise", time: "2 hours ago" },
    { action: "Review approved", item: "Kerala Backwaters", time: "4 hours ago" },
    { action: "Blog published", item: "Top 10 Hill Stations", time: "6 hours ago" },
    { action: "Lead generated", item: "Rajasthan Royal Tour", time: "8 hours ago" },
    { action: "Destination updated", item: "Himachal Pradesh", time: "1 day ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with JMT Travel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Plane className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-blue-900">Add New Trip</p>
                <p className="text-xs text-blue-600">Create a new travel package</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <MapPin className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-green-900">Add Destination</p>
                <p className="text-xs text-green-600">Add a new travel destination</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-purple-900">Write Blog</p>
                <p className="text-xs text-purple-600">Create a new blog post</p>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
                <Eye className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="font-medium text-yellow-900">View Reports</p>
                <p className="text-xs text-yellow-600">Check analytics & reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
