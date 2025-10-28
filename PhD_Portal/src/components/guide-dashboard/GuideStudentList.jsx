import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { User, ArrowRight, TrendingUp, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export function GuideStudentList({ students }) {
  // Show only first 5 students in dashboard
  const displayStudents = students.slice(0, 5)

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Student List ({students.length})
          </CardTitle>
          {students.length > 0 && (
            <Link
              to="/guide/students"
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          {displayStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <User className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Students Assigned</p>
              <p className="text-xs text-gray-400 mt-1">Students will appear here once assigned</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{student.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{student.batch}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Progress
                        </span>
                        <span className="text-xs font-semibold text-gray-900">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Attendance
                      </span>
                      <Badge
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          student.attendance >= 90 ? "bg-red-500 text-white" :
                          student.attendance >= 75 ? "bg-yellow-500 text-white" :
                          "bg-gray-400 text-white"
                        }`}
                      >
                        {student.attendance}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}