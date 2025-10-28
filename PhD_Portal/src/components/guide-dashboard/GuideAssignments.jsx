import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock, Unlock, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export function GuideAssignments({ assignments, onCreateClick }) {
  // Show only first 3 assignments in dashboard
  const displayAssignments = assignments.slice(0, 3)

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Assignments ({assignments.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {assignments.length > 0 && (
              <Link
                to="/guide/assignments"
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            <Link to="/guide/assignments">
              <Button size="sm" className="bg-red-500 hover:bg-red-600 h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Assignments Yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first assignment</p>
            </div>
          ) : (
            displayAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-2">
                      {assignment.title}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Uploaded on {assignment.uploadedDate}</div>
                      <div>Deadline {assignment.deadline}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`gap-1 px-3 py-1 rounded-full font-medium text-xs ${
                        assignment.status === "locked"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {assignment.status === "locked" ? (
                        <>
                          <Lock className="h-3 w-3" />
                          Locked
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3" />
                          Unlocked
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-red-500">
                    Submissions: {assignment.submissions}/{assignment.totalStudents}
                  </span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{
                        width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}