"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

/**
 * Thin client-component wrapper so we can use SessionProvider
 * inside the server-component root layout.
 */
export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
