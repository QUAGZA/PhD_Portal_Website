import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, Mail } from "lucide-react"
import { Link } from "react-router-dom"

export function AdminFacultyCoordinators({ coordinators }) {
  // Show only first 4 faculty coordinators in dashboard
  const displayCoordinators = coordinators?.slice(0, 4) || []

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#B7202E]" />
            Faculty Coordinators
          </CardTitle>
          {coordinators && coordinators.length > 4 && (
            <Link
              to="/admin/faculty-coordinators"
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayCoordinators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Faculty Coordinators</p>
              <p className="text-xs text-gray-400 mt-1">Coordinators will appear here</p>
            </div>
          ) : (
            displayCoordinators.map((coordinator) => (
              <div
                key={coordinator._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#B7202E] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {coordinator.personalDetails?.firstName?.charAt(0) || "?"}
                      {coordinator.personalDetails?.lastName?.charAt(0) || ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {coordinator.fullName || "No Name"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {coordinator.programDetails?.department || "N/A"}
                      </p>
                      <Badge className={getStatusColor(coordinator.status)}>
                        {coordinator.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
