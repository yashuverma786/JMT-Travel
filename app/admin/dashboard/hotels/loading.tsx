import { Skeleton } from "@/components/ui/skeleton"

export default function HotelsLoading() {
  // Display a simple skeleton list while data & searchParams resolve
  return (
    <div className="p-6 space-y-6">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
          <Skeleton className="h-16 w-24 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      ))}
    </div>
  )
}
