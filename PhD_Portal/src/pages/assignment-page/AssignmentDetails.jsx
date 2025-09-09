"use client";

import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  Edit3,
  Download,
} from "lucide-react";

export default function AssignmentDetails({ assignments }) {
  const { id } = useParams();
  const assignment = assignments.find((a) => a.id === id);

  if (!assignment)
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Assignment not found</div>
      </div>
    );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "not yet submitted":
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Operating Systems - Assignments
        </h1>
        <p className="text-gray-600 mt-1">Assignment Details</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            {assignment.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Status
                </span>
                <Badge
                  className={`px-3 py-1 text-sm font-medium border ${getStatusStyle(assignment.statusDescription)}`}
                >
                  {assignment.statusDescription}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  Deadline
                </span>
                <span className="text-gray-900 font-medium">
                  {assignment.deadline}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  Time Remaining
                </span>
                <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                  {assignment.timeRemaining}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Last Modified</span>
                <span className="text-gray-900">{assignment.lastModified}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Grade</span>
                <span className="text-gray-900 font-medium">
                  {assignment.grade}
                </span>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Comments</span>
                <span className="text-gray-900 text-right">
                  {assignment.comments}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="h-4 w-4 text-red-600" />
              Attachments
            </h4>
            <div className="flex flex-wrap gap-3">
              {assignment.attachments?.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 font-medium">{file.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-red-600" />
                My Submission
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>

            {assignment.submission ? (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <a
                  href={assignment.submission.url}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">
                    {assignment.submission.name}
                  </span>
                </a>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No submission yet</p>
                <Button className="mt-3 bg-red-600 hover:bg-red-700">
                  Upload Submission
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
