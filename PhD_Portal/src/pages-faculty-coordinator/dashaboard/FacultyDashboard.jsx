import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, User } from "lucide-react";
// import { useState, useEffect } from "react";
import {
  FacultyStudentList,
  FacultyGuideList,
  FacultySchedule,
  FacultyAnnouncements
} from "@/components/faculty-dashboard";
// import facultyDashboardService from "@/services/facultyDashboardService";

export default function FacultyDashboard() {
  // Dummy data for testing - will be replaced with real API calls later
  const students = [
    { id: 1, name: "Rahul Sharma", batch: "2023", progress: 85, attendance: 92, guideName: "Dr. Kumar" },
    { id: 2, name: "Priya Patel", batch: "2023", progress: 78, attendance: 88, guideName: "Dr. Mehta" },
    { id: 3, name: "Amit Kumar", batch: "2024", progress: 92, attendance: 95, guideName: "Dr. Kumar" },
    { id: 4, name: "Sneha Desai", batch: "2024", progress: 65, attendance: 80, guideName: "Dr. Singh" },
    { id: 5, name: "Vikram Singh", batch: "2022", progress: 88, attendance: 90, guideName: "Dr. Mehta" },
    { id: 6, name: "Anjali Mehta", batch: "2023", progress: 75, attendance: 85, guideName: "Dr. Kumar" },
  ]

  const guides = [
    { id: 1, name: "Dr. Rajesh Kumar", email: "r.kumar@university.edu", studentCount: 6, progress: 82, department: "Computer Science" },
    { id: 2, name: "Dr. Priya Mehta", email: "p.mehta@university.edu", studentCount: 4, progress: 88, department: "Computer Science" },
    { id: 3, name: "Dr. Amit Singh", email: "a.singh@university.edu", studentCount: 5, progress: 75, department: "Computer Science" },
  ]

  const summary = {
    facultyName: "Dr. Patel",
    department: "Computer Science"
  }

  const loading = false
  const error = null

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const [studentsData, guidesData, summaryData] = await Promise.all([
  //       facultyDashboardService.getStudents(),
  //       facultyDashboardService.getGuides(),
  //       facultyDashboardService.getSummary(),
  //     ]);

  //     setStudents(studentsData.students || []);
  //     setGuides(guidesData.guides || []);
  //     setSummary(summaryData.summary || null);
  //   } catch (err) {
  //     console.error("Error fetching dashboard data:", err);
  //     setError(err.message || "Failed to load dashboard data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/diverse-student-profiles.png" />
                <AvatarFallback className="bg-red-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, <span className="text-red-500">{summary?.facultyName || "Faculty Coordinator"}</span>
                </h1>
                <p className="text-sm text-gray-600">
                  Department: {summary?.department || "N/A"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
              <Bell className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Student List */}
          <div className="lg:col-span-1">
            <FacultyStudentList students={students} />
          </div>

          {/* Guide List */}
          <div className="lg:col-span-1">
            <FacultyGuideList guides={guides} />
          </div>

          {/* Center Content - Schedule & Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule */}
            <FacultySchedule />

            {/* Announcements */}
            <FacultyAnnouncements />
          </div>
        </div>
      </div>
    </div>
  );
}
