"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function AssignmentCard({ assignment }) {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "destructive";
      case "submitted":
        return "secondary";
      case "graded":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-red-600 bg-red-50 border-red-200";
      case "submitted":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "graded":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card
      onClick={() => navigate(`/student/assignments/${assignment.id}`)}
      className="cursor-pointer hover:shadow-lg hover:shadow-red-100/50 transition-all duration-200 border-gray-200 hover:border-red-200 group mb-6"
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
              {assignment.title}
            </CardTitle>

            <div className="flex items-center gap-4">
              {assignment.status && (
                <Badge
                  className={`px-3 py-1 text-xs font-medium border ${getStatusColor(assignment.status)}`}
                >
                  {assignment.status}
                </Badge>
              )}

              {assignment.deadline && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due {assignment.deadline}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox
              defaultChecked={
                assignment.status === "Graded" ||
                assignment.status === "Submitted"
              }
              className="h-5 w-5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
