import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuideAssignmentCard({ assignment }) {
  // For now, we'll use placeholder values since submission count isn't in the assignment data
  // This would need to be fetched separately or included in the assignment response
  const submissionRate = 0; // Placeholder - would come from actual submission data

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link to={`/guide/assignments/${assignment._id}`}>
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
                  <span>Due: {formatDate(assignment.deadline)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-amber-500" />
                  <span>
                    {assignment.attachments && assignment.attachments.length > 0
                      ? assignment.attachments[0]?.filename ||
                        "Attachments available"
                      : "No attachments"}
                    {assignment.attachments &&
                      assignment.attachments.length > 1 && (
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
                <span className="font-medium">0/0</span>
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
