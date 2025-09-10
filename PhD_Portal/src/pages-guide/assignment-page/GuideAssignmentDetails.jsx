import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  FileText,
  Edit3,
  Download,
  MessageCircle,
  User,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchAssignmentById,
  fetchSubmissionsForAssignment,
  gradeSubmission,
  selectCurrentAssignment,
  selectSubmissions,
  selectAssignmentLoading,
  selectAssignmentError,
  selectGradeLoading,
  clearCurrentAssignment,
} from "@/redux/slices/assignmentSlice";

export default function GuideAssignmentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const assignment = useSelector(selectCurrentAssignment);
  const submissions = useSelector(selectSubmissions);
  const loading = useSelector(selectAssignmentLoading);
  const error = useSelector(selectAssignmentError);
  const gradeLoading = useSelector(selectGradeLoading);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({
    grade: "",
    comments: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentById(id));
      dispatch(fetchSubmissionsForAssignment(id));
    }
    return () => {
      dispatch(clearCurrentAssignment());
    };
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) {
      return "Deadline passed";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} left`;
    } else {
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      grade: submission.grade || "",
      comments: submission.comments || "",
    });
    setShowGradeModal(true);
  };

  const submitGrade = async () => {
    if (!selectedSubmission || !gradeData.grade) return;

    try {
      await dispatch(
        gradeSubmission({
          submissionId: selectedSubmission._id,
          grade: parseInt(gradeData.grade),
          comments: gradeData.comments,
        }),
      ).unwrap();

      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ grade: "", comments: "" });

      // Refresh submissions
      dispatch(fetchSubmissionsForAssignment(id));
    } catch (error) {
      console.error("Failed to grade submission:", error);
    }
  };

  const getSubmissionStats = () => {
    const submitted = submissions.filter(
      (s) => s.status === "submitted" || s.status === "graded",
    ).length;
    const graded = submissions.filter((s) => s.status === "graded").length;
    return { submitted, graded, total: submissions.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-gray-500">Loading assignment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button
            onClick={() => dispatch(fetchAssignmentById(id))}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-gray-500">Assignment not found</div>
      </div>
    );
  }

  const stats = getSubmissionStats();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/guide/assignments"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Assignment Header */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-gray-900 mb-3">
                    {assignment.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <Badge
                      variant="outline"
                      className="border-amber-200 text-amber-700"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeRemaining(assignment.deadline)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {stats.submitted}/{stats.total} submitted
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {stats.graded} graded
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-red-500" />
                      <span className="text-gray-600">Deadline:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(assignment.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-amber-500" />
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(assignment.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <FileText className="w-4 h-4 mr-3 text-red-500 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Attachments:</span>
                        <div className="ml-2 space-y-1">
                          {assignment.attachments &&
                          assignment.attachments.length > 0 ? (
                            assignment.attachments.map((attachment, i) => (
                              <a
                                key={i}
                                href={`/uploads/${attachment.path}`}
                                className="block text-red-600 hover:text-red-700 font-medium"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="w-3 h-3 inline mr-1" />
                                {attachment.filename}
                              </a>
                            ))
                          ) : (
                            <span className="text-gray-500 ml-2">
                              No attachments
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {assignment.description && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm mb-2">Description:</p>
                    <p className="text-gray-800">{assignment.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submissions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <GraduationCap className="w-5 h-5 mr-2 text-red-500" />
                  Submissions ({stats.submitted}/{stats.total})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <Card
                      key={submission._id}
                      className="border border-gray-200 shadow-none"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {submission.student?.name || "Unknown Student"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {submission.student?.email || "No email"}
                              </p>
                              {submission.submittedAt && (
                                <p className="text-xs text-gray-500">
                                  Submitted:{" "}
                                  {formatDate(submission.submittedAt)}
                                </p>
                              )}
                            </div>
                          </div>

                          {submission.status === "graded" ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Grade: {submission.grade}
                            </Badge>
                          ) : submission.status === "submitted" ? (
                            <Badge
                              variant="outline"
                              className="border-amber-200 text-amber-700"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending Grade
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-gray-200 text-gray-700"
                            >
                              Not Submitted
                            </Badge>
                          )}
                        </div>

                        {submission.attachments &&
                          submission.attachments.length > 0 && (
                            <div className="flex items-center mb-3">
                              <FileText className="w-4 h-4 mr-2 text-red-500" />
                              <div className="space-y-1">
                                {submission.attachments.map((attachment, i) => (
                                  <a
                                    key={i}
                                    href={`/uploads/${attachment.path}`}
                                    className="block text-red-600 hover:text-red-700 font-medium text-sm"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Download className="w-3 h-3 inline mr-1" />
                                    {attachment.filename}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                        {submission.comments && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Comments:</span>{" "}
                              {submission.comments}
                            </p>
                          </div>
                        )}

                        {submission.status === "submitted" && (
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => handleGradeSubmission(submission)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Give Grade
                            </Button>
                          </div>
                        )}

                        {submission.status === "graded" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGradeSubmission(submission)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Edit Grade
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <MessageCircle className="w-5 h-5 mr-2 text-red-500" />Q & A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="text-center py-8 text-gray-500">
                  Q&A feature coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Grade Submission Modal */}
      <Dialog open={showGradeModal} onOpenChange={setShowGradeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Grade Submission
            </DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Student:</p>
                <p className="font-medium">
                  {selectedSubmission.student?.name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  type="number"
                  value={gradeData.grade}
                  onChange={(e) =>
                    setGradeData((prev) => ({ ...prev, grade: e.target.value }))
                  }
                  placeholder="Enter grade (0-100)"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={gradeData.comments}
                  onChange={(e) =>
                    setGradeData((prev) => ({
                      ...prev,
                      comments: e.target.value,
                    }))
                  }
                  placeholder="Add feedback for the student..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowGradeModal(false)}
                  disabled={gradeLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitGrade}
                  disabled={gradeLoading || !gradeData.grade}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {gradeLoading ? "Saving..." : "Save Grade"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
