"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation" // Added usePathname
import { AdminProvider, useAdmin } from "@/components/admin/admin-context" // Assuming useAdmin provides user info
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: userLoading } = useAdmin() // Get user from context

  useEffect(() => {
    if (!userLoading) {
      // Only check after user loading is complete
      const token = localStorage.getItem("adminAuthToken") // Or however you store the token
      if (!token && pathname !== "/admin") {
        // If no token and not on login page
        router.push("/admin")
      }
    }
  }, [router, userLoading, user, pathname]) // Add user and pathname to dependencies

  // If still loading user data, or if no user and not on login page, show loading or redirect
  if (userLoading && pathname !== "/admin") {
    return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>
  }

  // If trying to access dashboard without being logged in (and not on login page itself)
  if (!user && pathname !== "/admin" && !userLoading) {
    // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>
  }

  // If on the login page, don't render sidebar/navbar
  if (pathname === "/admin") {
    return <>{children}</>
  }

  // If logged in and on a dashboard page, render the layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}
