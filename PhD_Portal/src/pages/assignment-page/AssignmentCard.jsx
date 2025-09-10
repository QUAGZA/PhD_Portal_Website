"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function AssignmentCard({ assignment }) {
  const navigate = useNavigate();

  // Determine assignment status based on submissions and deadline
  const getAssignmentStatus = () => {
    const now = new Date();
    const deadline = new Date(assignment.deadline);

    // This would need to be enhanced to check actual submission status from backend
    // For now, we'll use a simple logic
    if (now > deadline) {
      return "overdue";
    }
    return "pending";
  };

  const status = getAssignmentStatus();

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "destructive";
      case "submitted":
        return "secondary";
      case "graded":
        return "default";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "submitted":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "graded":
        return "text-green-600 bg-green-50 border-green-200";
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

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
    <Card
      onClick={() => navigate(`/student/assignments/${assignment._id}`)}
      className="cursor-pointer hover:shadow-lg hover:shadow-red-100/50 transition-all duration-200 border-gray-200 hover:border-red-200 group mb-6"
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
              {assignment.title}
            </CardTitle>

            {assignment.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {assignment.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Badge
                className={`px-3 py-1 text-xs font-medium border ${getStatusColor(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>

              {assignment.deadline && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due {formatDate(assignment.deadline)}</span>
                </div>
              )}
            </div>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="text-xs text-gray-500">
                📎 {assignment.attachments.length} attachment
                {assignment.attachments.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Checkbox
              defaultChecked={status === "graded" || status === "submitted"}
              className="h-5 w-5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
