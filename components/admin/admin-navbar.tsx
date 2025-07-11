"use client"

import { Button } from "@/components/ui/button"
import { useAdmin } from "@/components/admin/admin-context"
import { LogOut, User } from "lucide-react"

export default function AdminNavbar() {
  const { user, logout } = useAdmin()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">JMT Travel Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{user?.role}</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
