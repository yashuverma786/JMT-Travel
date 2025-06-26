import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransfersLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container text-center">
          <Skeleton className="h-12 w-12 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-12 w-96 mx-auto mb-2 bg-white/20" />
          <Skeleton className="h-6 w-80 mx-auto bg-white/20" />
        </div>
      </section>

      <section className="container py-8">
        <Card className="mb-8 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-56 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
