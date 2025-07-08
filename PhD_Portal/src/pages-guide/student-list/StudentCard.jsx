import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function StudentCard({ student }) {
  return (
    <Link to={`/guide/students/${student.id}`}>
      <Card className="p-4 mb-2 hover:shadow-md transition">
        <div className="flex justify-between text-sm">
          <div>
            <p className="font-semibold">{student.name}</p>
            <p className="text-muted-foreground">{student.email}</p>
            <p className="text-xs">Domain of Research: {student.domain}</p>
            <p className="text-xs">
              Progress:{" "}
              <span className={student.progress < 50 ? "text-red-600" : ""}>
                {student.progress}%
              </span>{" "}
              &nbsp;&nbsp; Attendance: {student.attendance}%
            </p>
          </div>
          <div className="text-right">
            <p>Enrollment Id: {student.enrollmentId}</p>
            <p className="text-muted-foreground">{student.batch}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
