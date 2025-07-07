import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function GuideAssignmentCard({ assignment }) {
  return (
    <Link to={`/guide/assignments/${assignment.id}`}>
      <Card className="p-4 mb-3 hover:shadow-md transition">
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">{assignment.title}</p>
            <p className="text-sm">Attachments: {assignment.attachments[0]?.name || "None"}
              {assignment.attachments.length > 1 ? ` +${assignment.attachments.length - 1}` : ""}
            </p>
            <p className="text-sm">Deadline - {assignment.deadline}</p>
          </div>
          <div className="text-right">
            <p>Submissions: {assignment.submissionsCount} / {assignment.totalStudents}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
