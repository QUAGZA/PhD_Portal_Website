"use client";

import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

export default function GuideAssignmentDetails() {
  const { id } = useParams();

  const assignment = {
    title: "Experiment 2 - Disk Scheduling",
    deadline: "Saturday, 31/05/2025, 11:59 pm",
    timeRemaining: "1 day 2 hours",
    lastModified: "Saturday, 31/05/2025, 09:59 pm",
    attachments: [
      { name: "Exp2_WriteUp.docx", url: "#" },
      { name: "ReferenceMaterial.pdf", url: "#" },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    submissions: [
      {
        studentName: "Student 1 Name",
        enrollmentNo: "1234567890",
        attachment: { name: "Exp2_WriteUp.docx", url: "#" },
        grade: 22,
        maxGrade: 25,
      },
      {
        studentName: "Student 2 Name",
        enrollmentNo: "1234567890",
        attachment: { name: "Exp2_WriteUp.docx", url: "#" },
        grade: null,
      },
    ],
    questions: [
      {
        student: "Student Name",
        question: "Lorem Ipsum is simply dummy text of the printing.",
        answer: "Lorem Ipsum is simply dummy text of the printing.",
      },
      {
        student: "Student Name",
        question: "Lorem Ipsum is simply dummy text of the printing.",
        answer: null,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Assignment Header */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    {assignment.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge
                      variant="outline"
                      className="border-amber-200 text-amber-700"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {assignment.timeRemaining} left
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
                        {assignment.deadline}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-amber-500" />
                      <span className="text-gray-600">Last Modified:</span>
                      <span className="ml-2 font-medium">
                        {assignment.lastModified}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <FileText className="w-4 h-4 mr-3 text-red-500 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Attachments:</span>
                        <div className="ml-2 space-y-1">
                          {assignment.attachments.map((attachment, i) => (
                            <a
                              key={i}
                              href={attachment.url}
                              className="block text-red-600 hover:text-red-700 font-medium"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm mb-2">Description:</p>
                  <p className="text-gray-800">{assignment.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Submissions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <GraduationCap className="w-5 h-5 mr-2 text-red-500" />
                  Submissions ({assignment.submissions.length}/10)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.submissions.map((submission, i) => (
                  <Card key={i} className="border border-gray-200 shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {submission.studentName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Enrollment: {submission.enrollmentNo}
                            </p>
                          </div>
                        </div>
                        {submission.grade != null ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {submission.grade}/{submission.maxGrade}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-200 text-amber-700"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center mb-3">
                        <FileText className="w-4 h-4 mr-2 text-red-500" />
                        <a
                          href={submission.attachment.url}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          <Download className="w-3 h-3 inline mr-1" />
                          {submission.attachment.name}
                        </a>
                      </div>

                      <div className="flex gap-3">
                        {submission.grade == null && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Give Grade
                          </Button>
                        )}
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add feedback..."
                            className="min-h-[80px] text-sm border-gray-200 focus:border-red-300 focus:ring-red-200"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Q&A Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <MessageCircle className="w-5 h-5 mr-2 text-red-500" />Q & A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {assignment.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center mb-2">
                      <User className="w-3 h-3 mr-1 text-gray-500" />
                      <p className="font-medium text-sm text-gray-900">
                        {q.student}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 bg-gray-50 p-2 rounded">
                        <span className="text-red-600 font-medium">Q:</span>{" "}
                        {q.question}
                      </p>
                      {q.answer ? (
                        <p className="text-gray-700 bg-green-50 p-2 rounded">
                          <span className="text-green-600 font-medium">A:</span>{" "}
                          {q.answer}
                        </p>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
