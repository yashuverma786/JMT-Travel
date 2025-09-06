"use client"

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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened.</p>
            <button onClick={() => reset()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4">
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
