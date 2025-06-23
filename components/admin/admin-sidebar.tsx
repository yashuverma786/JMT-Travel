"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  Plane,
  Star,
  Newspaper,
  Users,
  Briefcase,
  Mail,
  Download,
  Globe,
  Tag,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },
    {
      name: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
      permissions: ["manage_users"],
    },
    {
      name: "Destinations",
      href: "/admin/dashboard/destinations",
      icon: MapPin,
      permissions: ["manage_destinations"],
    },
    {
      name: "Trip Types",
      href: "/admin/dashboard/trip-types",
      icon: Tag,
      permissions: ["manage_trips"], // Assuming trip types are managed by trip managers
    },
    {
      name: "Trips",
      href: "/admin/dashboard/trips",
      icon: Plane,
      permissions: ["manage_trips"],
    },
    {
      name: "Activities",
      href: "/admin/dashboard/activities",
      icon: Globe,
      permissions: ["manage_trips"], // Assuming activities are part of trip management
    },
    {
      name: "Reviews",
      href: "/admin/dashboard/reviews",
      icon: Star,
      permissions: ["manage_reviews"],
    },
    {
      name: "Blogs",
      href: "/admin/dashboard/blogs",
      icon: Newspaper,
      permissions: ["manage_blogs"],
    },
    {
      name: "Collaborators",
      href: "/admin/dashboard/collaborators",
      icon: Briefcase,
      permissions: ["manage_partners"],
    },
    {
      name: "Leads",
      href: "/admin/dashboard/leads",
      icon: Mail,
      permissions: ["view_analytics"], // Assuming leads are viewed by analytics/sales
    },
    {
      name: "Distribution",
      href: "/admin/dashboard/distribution",
      icon: Download, // Using download for distribution as it implies managing external content
      permissions: ["approve_listings"],
    },
  ]

  // In a real app, you'd fetch user permissions from context/state
  // For now, we'll assume a super_admin has all permissions for demo purposes
  const userPermissions = [
    "manage_users",
    "manage_destinations",
    "manage_trips",
    "manage_bookings",
    "manage_reviews",
    "manage_blogs",
    "manage_partners",
    "view_analytics",
    "approve_listings",
    "manage_payments",
  ] // Replace with actual user permissions

  const hasPermission = (requiredPermissions: string[]) => {
    if (requiredPermissions.length === 0) return true // No specific permission required
    return requiredPermissions.some((permission) => userPermissions.includes(permission))
  }

  return (
    <aside className="w-64 bg-gray-900 text-white h-full flex flex-col p-4">
      <div className="text-2xl font-bold mb-8 text-center">JMT Admin</div>
      <nav className="flex-1 space-y-2">
        {navItems.map(
          (item) =>
            hasPermission(item.permissions) && (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-gray-50 hover:bg-gray-800",
                  pathname === item.href && "bg-gray-800 text-gray-50",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ),
        )}
      </nav>
    </aside>
  )
}
