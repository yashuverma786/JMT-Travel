"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAdmin } from "./admin-context"
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
  HotelIcon,
  Car,
  UserIcon as CustomRequestIcon,
} from "lucide-react"
import type { PermissionValue } from "@/lib/permissions" // Ensure this path is correct

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useAdmin() // Get user from context

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permissions: [] },
    { name: "Users", href: "/admin/dashboard/users", icon: Users, permissions: ["manage_users"] },
    { name: "Destinations", href: "/admin/dashboard/destinations", icon: MapPin, permissions: ["manage_destinations"] },
    { name: "Trip Types", href: "/admin/dashboard/trip-types", icon: Tag, permissions: ["manage_trips"] },
    { name: "Trips", href: "/admin/dashboard/trips", icon: Plane, permissions: ["manage_trips"] },
    { name: "Activities", href: "/admin/dashboard/activities", icon: Globe, permissions: ["manage_trips"] },
    {
      name: "Hotels",
      href: "/admin/dashboard/hotels",
      icon: HotelIcon,
      permissions: ["manage_hotels", "manage_own_hotels"],
    },
    {
      name: "Transfers",
      href: "/admin/dashboard/transfers",
      icon: Car,
      permissions: ["manage_transfers", "manage_rentals"],
    },
    { name: "Car Rentals", href: "/admin/dashboard/rentals", icon: Car, permissions: ["manage_rentals"] },
    { name: "Reviews", href: "/admin/dashboard/reviews", icon: Star, permissions: ["manage_reviews"] },
    { name: "Blogs", href: "/admin/dashboard/blogs", icon: Newspaper, permissions: ["manage_blogs"] },
    {
      name: "Collaborators",
      href: "/admin/dashboard/collaborators",
      icon: Briefcase,
      permissions: ["manage_partners"],
    },
    { name: "Leads", href: "/admin/dashboard/leads", icon: Mail, permissions: ["view_analytics"] },
    { name: "Distribution", href: "/admin/dashboard/distribution", icon: Download, permissions: ["approve_listings"] },
    {
      name: "Custom Requests",
      href: "/admin/dashboard/custom-requests",
      icon: CustomRequestIcon,
      permissions: ["manage_trips"],
    },
  ].filter(Boolean) as { name: string; href: string; icon: any; permissions: string[] }[]

  const hasPermission = (requiredPermissions: string[]) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      // If user or user.permissions is not loaded or not an array, deny permission
      return false
    }
    if (user.role === "super_admin") return true // Super admin has all permissions
    if (requiredPermissions.length === 0) return true // No specific permissions required

    return requiredPermissions.some((permission) =>
      (user.permissions as PermissionValue[]).includes(permission as PermissionValue),
    )
  }

  if (!user) {
    // Optional: Show a loading state or minimal sidebar if user data isn't ready
    return (
      <aside className="w-64 bg-gray-900 text-white h-screen flex-col p-4 hidden md:flex sticky top-0">
        <div className="text-2xl font-bold mb-8 text-center">JMT Admin</div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          <p className="text-gray-400 px-3 py-2">Loading navigation...</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex-col p-4 hidden md:flex sticky top-0">
      <div className="text-2xl font-bold mb-8 text-center">JMT Admin</div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(
          (item) =>
            hasPermission(item.permissions) && (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all hover:text-white hover:bg-gray-800 text-sm",
                  pathname === item.href && "bg-gray-700 text-white",
                  pathname.startsWith(item.href) && item.href !== "/admin/dashboard" && "bg-gray-700 text-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ),
        )}
      </nav>
    </aside>
  )
}
