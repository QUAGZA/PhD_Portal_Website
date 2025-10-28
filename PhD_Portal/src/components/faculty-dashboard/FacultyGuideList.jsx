import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserCheck, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function FacultyGuideList({ guides }) {
  // Show only first 5 guides in dashboard
  const displayGuides = guides.slice(0, 5)

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Guide List ({guides.length})
          </CardTitle>
          {guides.length > 5 && (
            <span className="flex items-center gap-1 text-xs text-red-500">
              View All
              <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          {displayGuides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <UserCheck className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Guides Found</p>
              <p className="text-xs text-gray-400 mt-1">Guides will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {guide.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {guide.email}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-gray-600">Students</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {guide.studentCount || 0}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-gray-600">Progress</p>
                          <p
                            className={`text-sm font-semibold ${
                              guide.progress >= 75
                                ? "text-green-600"
                                : guide.progress >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {guide.progress}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {guide.department && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Department: <span className="text-gray-700 font-medium">{guide.department}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
