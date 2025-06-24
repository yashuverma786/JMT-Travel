"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
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
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/dashboard/users", icon: Users },
    { name: "Destinations", href: "/admin/dashboard/destinations", icon: MapPin },
    { name: "Trip Types", href: "/admin/dashboard/trip-types", icon: Tag },
    { name: "Trips", href: "/admin/dashboard/trips", icon: Plane },
    { name: "Activities", href: "/admin/dashboard/activities", icon: Globe },
    { name: "Hotels", href: "/admin/dashboard/hotels", icon: HotelIcon },
    { name: "Car Rentals", href: "/admin/dashboard/rentals", icon: Car },
    { name: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
    { name: "Blogs", href: "/admin/dashboard/blogs", icon: Newspaper },
    { name: "Collaborators", href: "/admin/dashboard/collaborators", icon: Briefcase },
    { name: "Leads", href: "/admin/dashboard/leads", icon: Mail },
    { name: "Distribution", href: "/admin/dashboard/distribution", icon: Download },
    { name: "Custom Requests", href: "/admin/dashboard/custom-requests", icon: CustomRequestIcon },
  ]

  const SidebarContent = () => (
    <>
      <div className="text-xl font-bold mb-8 text-center text-white">JMT Admin</div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all hover:text-white hover:bg-gray-800 text-sm",
              pathname === item.href && "bg-gray-700 text-white",
              pathname.startsWith(item.href) && item.href !== "/admin/dashboard" && "bg-gray-700 text-white",
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white hover:bg-gray-800"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop Sidebar - Always Visible & Sticky */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white h-screen flex-col p-4 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Collapsible */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 w-64 bg-gray-900 text-white h-screen flex-col p-4 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
