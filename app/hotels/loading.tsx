import { Skeleton } from "@/components/ui/skeleton"

/**
 * Suspense fallback for the /hotels listing page.
 * Shows a simple responsive grid of skeleton cards while
 * the page fetches data (and search params) on first load / navigation.
 */
export default function HotelsLoading() {
  return (
    <div className="container py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-3">
            {/* image placeholder */}
            <Skeleton className="h-48 w-full rounded-lg" />
            {/* hotel name placeholder */}
            <Skeleton className="h-6 w-3/4" />
            {/* location / price placeholder */}
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
