"use client"

import Link from "next/link"
import { Home, Users, Settings, Hotel, Car } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { type PermissionValue, PERMISSIONS } from "@/lib/permissions"

interface AdminSidebarProps {
  userPermissions: PermissionValue[]
}

const AdminSidebar = ({ userPermissions }: AdminSidebarProps) => {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: Home,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      href: "/admin/dashboard/settings",
      label: "Settings",
      icon: Settings,
      permission: PERMISSIONS.MANAGE_SETTINGS,
    },
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
        <div className="space-y-1">
          {routes.map(
            (route) =>
              userPermissions.includes(route.permission) && (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-secondary-foreground",
                    pathname === route.href ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              ),
          )}
          {userPermissions.includes(PERMISSIONS.MANAGE_HOTELS) && (
            <Link
              href="/admin/dashboard/hotels"
              className={cn(
                "group flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-secondary-foreground",
                pathname === "/admin/dashboard/hotels"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Hotel className="mr-2 h-4 w-4" /> Hotels
            </Link>
          )}

          {userPermissions.includes(PERMISSIONS.MANAGE_RENTALS) && (
            <Link
              href="/admin/dashboard/rentals"
              className={cn(
                "group flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-secondary-foreground",
                pathname === "/admin/dashboard/rentals"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Car className="mr-2 h-4 w-4" /> Rentals
            </Link>
          )}

          {userPermissions.includes(PERMISSIONS.MANAGE_USERS) && (
            <Link
              href="/admin/dashboard/users"
              className={cn(
                "group flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-secondary-foreground",
                pathname === "/admin/dashboard/users"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Users className="mr-2 h-4 w-4" /> Users
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
export { AdminSidebar }
