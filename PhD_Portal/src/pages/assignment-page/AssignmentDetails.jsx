import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useRequireAuth from "../../hooks/useRequireAuth"
import { use } from "react"
export default function AssignmentDetails({ assignments }) {
  useRequireAuth(["student", "admin"]);
  const { id } = useParams()
  const assignment = assignments.find((a) => a.id === id)

  if (!assignment) return <div>Assignment not found</div>

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Operating Systems - Assignments</h2>
      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="font-medium">Status</span>
            <span>{assignment.statusDescription}</span>

            <span className="font-medium">Deadline</span>
            <span>{assignment.deadline}</span>

            <span className="font-medium">Time Remaining</span>
            <Badge className="w-fit bg-green-500 hover:bg-green-600">
              {assignment.timeRemaining}
            </Badge>

            <span className="font-medium">Last Modified</span>
            <span>{assignment.lastModified}</span>

            <span className="font-medium">Grade</span>
            <span>{assignment.grade}</span>

            <span className="font-medium">Comments</span>
            <span>{assignment.comments}</span>
          </div>

          <div>
            <h4 className="font-medium mt-4 mb-2">Attachments</h4>
            <div className="flex gap-2">
              {assignment.attachments.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  className="underline text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mt-4 mb-1">My Submission <span className="text-blue-500 text-xs cursor-pointer">Edit</span></h4>
            <div className="p-2 border rounded w-fit">
              <a
                href={assignment.submission.url}
                className="text-sm text-muted-foreground underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {assignment.submission.name}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
