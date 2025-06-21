"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAdmin } from "./admin-context"
import {
  MapPin,
  Plane,
  Activity,
  Star,
  FileText,
  UserCheck,
  MessageSquare,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Route,
  Download,
  Users,
  Share2,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/dashboard/users", icon: Users },
  { name: "Distribution", href: "/admin/dashboard/distribution", icon: Share2 },
  { name: "Destinations", href: "/admin/dashboard/destinations", icon: MapPin },
  { name: "Trip Types", href: "/admin/dashboard/trip-types", icon: Route },
  { name: "Activities", href: "/admin/dashboard/activities", icon: Activity },
  { name: "Trips", href: "/admin/dashboard/trips", icon: Plane },
  { name: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
  { name: "Blogs", href: "/admin/dashboard/blogs", icon: FileText },
  { name: "Collaborators", href: "/admin/dashboard/collaborators", icon: UserCheck },
  { name: "Trip Leads", href: "/admin/dashboard/leads", icon: MessageSquare },
  { name: "Downloads", href: "/admin/dashboard/downloads", icon: Download },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { sidebarOpen, setSidebarOpen } = useAdmin()
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!collapsed && <h2 className="text-xl font-bold text-gray-900">JMT Admin</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md hover:bg-gray-100 hidden lg:block"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed && "justify-center",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
