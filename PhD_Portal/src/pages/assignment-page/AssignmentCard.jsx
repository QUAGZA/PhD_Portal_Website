import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import useRequireAuth from "../../hooks/useRequireAuth"
export default function AssignmentCard({ assignment }) {
  const navigate = useNavigate()
  useRequireAuth(["student", "admin"]);

  return (
    <Card
      onClick={() => navigate(`/student/assignments/${assignment.id}`)}
      className="cursor-pointer hover:shadow-md transition"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{assignment.title}</CardTitle>
          <CardDescription className="text-sm space-y-1">
            {assignment.status && (
              <Badge
                variant={
                  assignment.status.toLowerCase() === "pending"
                    ? "destructive"
                    : assignment.status.toLowerCase() === "graded"
                    ? "success"
                    : "default"
                }
              >
                {assignment.status}
              </Badge>
            )}
            {assignment.deadline && <p>Deadline - {assignment.deadline}</p>}
          </CardDescription>
        </div>
        <Checkbox defaultChecked={assignment.status === "Graded" || assignment.status === "Submitted"} />
      </CardHeader>
    </Card>
  )
}
