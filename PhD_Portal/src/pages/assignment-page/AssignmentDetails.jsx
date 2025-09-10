"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Upload, Download } from "lucide-react";
import {
  fetchAssignmentById,
  selectCurrentAssignment,
  selectAssignmentLoading,
  selectAssignmentError,
  submitAssignment,
  selectSubmissionLoading,
  clearCurrentAssignment,
} from "@/redux/slices/assignmentSlice";

export default function AssignmentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const assignment = useSelector(selectCurrentAssignment);
  const loading = useSelector(selectAssignmentLoading);
  const error = useSelector(selectAssignmentError);
  const submissionLoading = useSelector(selectSubmissionLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentById(id));
    }
    return () => {
      dispatch(clearCurrentAssignment());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Loading assignment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button
          onClick={() => dispatch(fetchAssignmentById(id))}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Assignment not found</div>
      </div>
    );
  }

  const getAssignmentStatus = () => {
    const now = new Date();
    const deadline = new Date(assignment.deadline);

    // This would be determined by checking submission status from backend
    // For now, we'll use simple logic
    if (now > deadline) {
      return "overdue";
    }
    return "pending";
  };

  const status = getAssignmentStatus();

  const getStatusStyle = (status) => {
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

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Handle file upload logic here
    console.log("Files selected:", files);
  };

  const handleSubmitAssignment = () => {
    const submissionData = {
      assignmentId: assignment._id,
      attachments: [], // This would contain uploaded files
    };

    dispatch(submitAssignment(submissionData));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Assignment Details</h1>
        <p className="text-gray-600 mt-1">
          Created by: {assignment.createdBy?.name || "Unknown"}
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            {assignment.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {assignment.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{assignment.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Status
                </span>
                <Badge
                  className={`px-3 py-1 text-sm font-medium border ${getStatusStyle(status)}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  Deadline
                </span>
                <span className="text-gray-900 font-medium">
                  {formatDate(assignment.deadline)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  Created
                </span>
                <span className="text-gray-900 font-medium">
                  {formatDate(assignment.createdAt)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Last Modified</span>
                <span className="text-gray-900">
                  {formatDate(assignment.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Grade</span>
                <span className="text-gray-900 font-medium">Not Graded</span>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Comments</span>
                <span className="text-gray-900 text-right">-</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="h-4 w-4 text-red-600" />
              Attachments
            </h4>
            <div className="flex flex-wrap gap-3">
              {assignment.attachments && assignment.attachments.length > 0 ? (
                assignment.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={`/uploads/${file.path}`}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 text-red-600" />
                    <span className="text-red-700 font-medium">
                      {file.filename}
                    </span>
                  </a>
                ))
              ) : (
                <div className="text-gray-500">No attachments</div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-red-600" />
                My Submission
              </h4>
            </div>

            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-4">No submission yet</p>

              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.zip"
              />

              <div className="space-y-2">
                <label htmlFor="file-upload">
                  <Button
                    className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    asChild
                  >
                    <span>Choose Files</span>
                  </Button>
                </label>

                <Button
                  onClick={handleSubmitAssignment}
                  disabled={submissionLoading}
                  className="ml-2 bg-green-600 hover:bg-green-700"
                >
                  {submissionLoading ? "Submitting..." : "Submit Assignment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
