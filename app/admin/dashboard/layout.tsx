"use client"

import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"

import { AdminProvider, useAdmin } from "@/components/admin/admin-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { Toaster } from "@/components/ui/toaster"

/**
 * The inner layout can safely call `useAdmin` because it is
 * wrapped by <AdminProvider> in the default export below.
 */
function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { user, sidebarOpen } = useAdmin()

  /* ------------------------------------------------------------------
   * 1️⃣  Loading / unauthenticated state
   * ------------------------------------------------------------------ */
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Loading admin dashboard…</span>
      </div>
    )
  }

  /* ------------------------------------------------------------------
   * 2️⃣  Permissions array is guaranteed to be an array (fallback = [])
   * ------------------------------------------------------------------ */
  const userPermissions: string[] = Array.isArray(user.permissions) ? user.permissions : []

  /* ------------------------------------------------------------------
   * 3️⃣  Render the actual dashboard layout
   * ------------------------------------------------------------------ */
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar userPermissions={userPermissions} />

      {/* Apply a left margin on desktop so content never sits under the sidebar */}
      <div
        className={`flex flex-1 flex-col transition-[margin] duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <Toaster />
    </div>
  )
}

/* ----------------------------------------------------------------------
 * 🌟 Default export wraps everything in <AdminProvider> so that
 *    context & permissions are available everywhere inside the dashboard.
 * -------------------------------------------------------------------- */
export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AdminProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AdminProvider>
  )
}
