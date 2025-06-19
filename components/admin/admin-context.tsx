"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AdminContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: string | null
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminUser")
    }
    return null
  })

  return <AdminContext.Provider value={{ sidebarOpen, setSidebarOpen, user }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
