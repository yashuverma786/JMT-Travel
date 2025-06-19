"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminProvider } from "@/components/admin/admin-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminNavbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  )
}
