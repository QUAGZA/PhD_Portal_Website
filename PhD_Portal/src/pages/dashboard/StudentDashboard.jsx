"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import studentDashboardService from "@/services/studentDashboardService";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        coursesData,
        assignmentsData,
        announcementsData,
        progressResponse,
        resourcesData,
        summaryData,
      ] = await Promise.all([
        studentDashboardService.getCourses(),
        studentDashboardService.getAssignments(),
        studentDashboardService.getAnnouncements(),
        studentDashboardService.getProgress(),
        studentDashboardService.getResources(),
        studentDashboardService.getSummary(),
      ]);

      setCourses(coursesData.courses || []);
      setAssignments(assignmentsData.assignments || []);
      setAnnouncements(announcementsData.announcements || []);
      setProgressData(progressResponse.progressData || []);
      setResources(resourcesData.resources || []);
      setSummary(summaryData.summary || null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] p-6">
        <Skeleton className="h-20 w-full mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 rounded-lg py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full border border-gray-100">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-gray-100">
                <User className="h-5 w-5 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-medium">Hello, {summary?.studentName || "Student"}!</h1>
              <p className="text-sm text-gray-500">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Bell className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* My Courses */}
            <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#B7202E]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3.5 18V7C3.5 3 4.5 2 8.5 2H15.5C19.5 2 20.5 3 20.5 7V17C20.5 17.14 20.5 17.28 20.49 17.42"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.35 15H20.5V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7H16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 10.5H13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <CardTitle className="text-lg font-medium">
                    My Courses
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-7 w-7"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-7 w-7"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {courses.length > 0 ? (
                    courses.map((course, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm"
                      >
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium text-base">
                              {course.courseName || course.courseCode}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {course.semester}
                            </p>
                            <p className="text-sm text-gray-500">
                              Faculty - {course.faculty}
                            </p>
                            <p className="text-sm text-gray-500">
                              {course.credits} Credits
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#B7202E] rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-gray-500">
                      No courses available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assignments */}
            <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#B7202E]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M8 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9.09H20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <CardTitle className="text-lg font-medium">
                    Assignments
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-7 w-7"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-7 w-7"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg"
                      >
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Course - {assignment.course}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              Due: {assignment.dueDate}
                            </span>
                            <span>Faculty - {assignment.faculty}</span>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            assignment.status === "submitted"
                              ? "bg-[#B7202E]"
                              : assignment.status === "overdue"
                              ? "bg-red-700"
                              : "bg-[#58595B]"
                          } text-white rounded px-2 py-0.5 text-sm font-normal`}
                        >
                          {assignment.status === "submitted"
                            ? "Submitted"
                            : assignment.status === "overdue"
                            ? "Overdue"
                            : "Pending"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No assignments available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white px-6 py-4 flex flex-col items-start border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#B7202E]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 3C16.95 8.84 16.95 15.16 15 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <CardTitle className="text-lg font-medium">
                    Course Progress
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-500 ml-7">
                  Subject-wise progress overview
                </p>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {progressData.map((item) => (
                    <div key={item.subject} className="text-center">
                      <div className="relative w-16 h-16 mx-auto">
                        <svg
                          className="w-16 h-16 transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="stroke-[#f0f0f0] stroke-[3]"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="stroke-[#B7202E] stroke-[3]"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={`${item.progress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-1">{item.subject}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white px-6 py-4 flex flex-row items-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#B7202E]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                    />
                  </svg>
                  <CardTitle className="text-lg font-medium">
                    Announcements
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {announcements.length > 0 ? (
                    announcements.map((announcement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#58595B] rounded-full flex-shrink-0" />
                        <span className="text-base">{announcement.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No announcements
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white px-6 py-4 flex flex-row items-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#B7202E]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5.48999V20.49"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 8.48999H5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 11.49H5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <CardTitle className="text-lg font-medium">
                    Resources
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {resources.length > 0 ? (
                    resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#58595B] rounded-full flex-shrink-0" />
                        <span className="text-base">{resource.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No resources available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
