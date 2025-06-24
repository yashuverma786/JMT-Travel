"use client"

import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { AdminProvider, useAdmin } from "@/components/admin/admin-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar" // This is the one using useAdmin()
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { Toaster } from "@/components/ui/toaster"

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { user, sidebarOpen } = useAdmin()

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Loading admin dashboard…</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* AdminSidebar now consumes context directly, no 'userPermissions' prop needed */}
      <AdminSidebar />
      <div
        className={`flex flex-1 flex-col transition-[margin] duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-64" : "md:ml-20" // Adjust if your sidebar widths are different
        }`}
      >
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AdminProvider>
  )
}
