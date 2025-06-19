import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomizeTourLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-16">
      <div className="container px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="text-center">
            <Skeleton className="h-8 sm:h-10 w-80 mx-auto mb-3" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <Skeleton className="h-6 w-64 mx-auto bg-white/20" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trip Details */}
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* More sections */}
                {[1, 2, 3].map((section) => (
                  <div key={section}>
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {[1, 2].map((i) => (
                        <div key={i}>
                          <Skeleton className="h-4 w-28 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Skeleton className="h-12 w-64 mx-auto rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
