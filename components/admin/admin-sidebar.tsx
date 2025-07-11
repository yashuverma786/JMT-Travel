"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPin, Plane, Hotel, Car, Users, MessageSquare, FileText, Activity } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Destinations",
    href: "/admin/dashboard/destinations",
    icon: MapPin,
  },
  {
    title: "Trips",
    href: "/admin/dashboard/trips",
    icon: Plane,
  },
  {
    title: "Hotels",
    href: "/admin/dashboard/hotels",
    icon: Hotel,
  },
  {
    title: "Transfers",
    href: "/admin/dashboard/transfers",
    icon: Car,
  },
  {
    title: "Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/admin/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    title: "Blogs",
    href: "/admin/dashboard/blogs",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/admin/dashboard/activities",
    icon: Activity,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
