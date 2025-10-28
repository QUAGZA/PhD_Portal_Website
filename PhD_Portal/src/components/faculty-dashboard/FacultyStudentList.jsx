import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function FacultyStudentList({ students }) {
  // Show only first 5 students in dashboard
  const displayStudents = students.slice(0, 5)

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Student List ({students.length})
          </CardTitle>
          {students.length > 5 && (
            <Link
              to="/faculty-coordinator/students"
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
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
              <p className="text-xs text-gray-400 mt-1">Students will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {student.batch || "Batch-Unknown"}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span
                            className={`font-medium ${
                              student.progress >= 75
                                ? "text-green-600"
                                : student.progress >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {student.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              student.progress >= 75
                                ? "bg-green-500"
                                : student.progress >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Attendance</span>
                          <span className="font-medium text-gray-900">
                            {student.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {student.guideName && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Guide: <span className="text-gray-700 font-medium">{student.guideName}</span>
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
