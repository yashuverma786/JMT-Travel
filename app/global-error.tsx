"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Error</h2>
            <p className="text-gray-600 mb-6">A critical error occurred. Please try refreshing the page.</p>
            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
