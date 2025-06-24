"use client"

import type React from "react"
import { AdminProvider } from "@/components/admin/admin-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        {/* Main content with proper margin for desktop sidebar */}
        <div className="md:ml-64 flex flex-col min-h-screen">
          <AdminNavbar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminProvider>
  )
}
