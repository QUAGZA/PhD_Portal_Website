import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, ArrowRight, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

export function AdminGuideAssignments({ assignments }) {
  // Show only first 4 guide assignments in dashboard
  const displayAssignments = assignments?.slice(0, 4) || []

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#B7202E]" />
            Guide Assignments
          </CardTitle>
          {assignments && assignments.length > 4 && (
            <Link
              to="/admin/guide-assignments"
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
          {displayAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserCheck className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Assignments</p>
              <p className="text-xs text-gray-400 mt-1">Guide assignments will appear here</p>
            </div>
          ) : (
            displayAssignments.map((assignment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {assignment.guideName || "Unknown Guide"}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {assignment.department || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{assignment.studentCount || 0} students assigned</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {assignment.progress || 0}% avg progress
                    </span>
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
