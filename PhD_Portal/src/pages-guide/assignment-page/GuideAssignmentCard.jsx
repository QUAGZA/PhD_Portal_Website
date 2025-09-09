import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuideAssignmentCard({ assignment }) {
  const submissionRate =
    (assignment.submissionsCount / assignment.totalStudents) * 100;

  return (
    <Link to={`/guide/assignments/${assignment.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-red-100/50 bg-white mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                {assignment.title}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  <span>Due: {assignment.deadline}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-amber-500" />
                  <span>
                    {assignment.attachments[0]?.name || "No attachments"}
                    {assignment.attachments.length > 1 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        +{assignment.attachments.length - 1}
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-1 text-red-500" />
                <span className="font-medium">
                  {assignment.submissionsCount}/{assignment.totalStudents}
                </span>
              </div>

              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${submissionRate}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {Math.round(submissionRate)}% submitted
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
