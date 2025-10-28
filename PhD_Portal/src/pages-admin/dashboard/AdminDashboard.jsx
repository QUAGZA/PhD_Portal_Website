import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Bug,
} from "lucide-react";
import adminService from "../../services/adminService";
import {
  AdminStatsOverview,
  AdminUserManagement,
  AdminGuideAssignments,
  AdminFacultyCoordinators,
  AdminSchedule,
  AdminAnalytics,
} from "@/components/admin-dashboard";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [facultyCoordinators, setFacultyCoordinators] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [guideAssignments, setGuideAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalGuides: 0,
    totalFacultyCoordinators: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
    assignmentPercentage: 0,
    registrationPercentage: 0,
    departmentDistribution: [],
    guideWorkload: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    // Debug user authentication first
    try {
      const debugInfo = await adminService.debugUserAuth();
      console.log("Debug auth info:", debugInfo);

      if (!debugInfo.debug?.hasAdminRole) {
        setError(
          `Access denied. You need Admin role. Current roles: ${debugInfo.user?.roles?.join(", ") || "None"}. Please contact an administrator to add Admin role to your account.`,
        );
        setLoading(false);
        return;
      }
    } catch (debugError) {
      console.error("Debug auth failed:", debugError);
    }

    console.log("Current user data:", {
      user: user,
      isAuthenticated: isAuthenticated,
      roles: user?.roles,
      primaryRole: user?.roles?.[0],
    });

    try {
      const [statsData, facultyData, scheduleData, usersData] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getFacultyCoordinators(1, 10),
        adminService.getScheduleEvents(),
        adminService.getAllUsers(1, 10).catch(() => ({ users: [] })),
      ]);

      setStats(statsData);
      setFacultyCoordinators(facultyData.facultyCoordinators || []);
      setScheduleEvents(scheduleData.events || []);
      setUsers(usersData.users || []);

      // Generate dummy guide assignments data
      setGuideAssignments([
        { guideName: "Dr. Rajesh Kumar", department: "Computer Science", studentCount: 12, progress: 85 },
        { guideName: "Dr. Priya Mehta", department: "Electronics", studentCount: 8, progress: 92 },
        { guideName: "Dr. Amit Singh", department: "Mechanical", studentCount: 10, progress: 78 },
        { guideName: "Dr. Sneha Patel", department: "Civil", studentCount: 6, progress: 88 },
        { guideName: "Dr. Vikram Sharma", department: "Computer Science", studentCount: 9, progress: 80 },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 403) {
        setError(
          `Access denied. Your roles: ${user?.roles?.join(", ") || "None"}. You need Admin role to access this dashboard.`,
        );
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#B7202E]" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={refreshData}
            className="bg-[#B7202E] hover:bg-[#A01B26]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 font-[Marcellus]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.personalDetails?.firstName || "Administrator"}
          </p>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {user?.roles && (
              <Badge variant="secondary">Roles: {user.roles.join(", ")}</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                setShowDebugInfo(!showDebugInfo);
                if (!showDebugInfo) {
                  try {
                    const debugInfo = await adminService.debugUserAuth();
                    console.log("Auth debug info:", debugInfo);
                  } catch (error) {
                    console.error("Debug failed:", error);
                  }
                }
              }}
            >
              <Bug className="h-4 w-4 mr-1" />
              Debug
            </Button>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-[#B7202E] hover:bg-[#A01B26]" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Debug Information */}
      {showDebugInfo && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pt-4">
            <CardTitle className="text-yellow-800">Debug Information</CardTitle>
            <CardDescription className="text-yellow-700">
              If you're getting 403 errors, you likely need the Admin role added
              to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Authentication Status:</strong>{" "}
                {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
              </div>
              <div>
                <strong>User Email:</strong> {user?.email || "Not available"}
              </div>
              <div>
                <strong>User Roles:</strong>{" "}
                {user?.roles ? JSON.stringify(user.roles) : "Not available"}
              </div>
              <div>
                <strong>Primary Role:</strong>{" "}
                {user?.roles?.[0] || "Not available"}
              </div>
              <div>
                <strong>Has Admin Role:</strong>{" "}
                {user?.roles?.includes("Admin") ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Registration Complete:</strong>{" "}
                {user?.registrationComplete ? "✅ Yes" : "❌ No"}
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded border">
              <strong>Solution for 403 errors:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to your backend directory</li>
                <li>
                  Run:{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    node utility/addAdminRole.js {user?.email}
                  </code>
                </li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <AdminStatsOverview stats={stats} />

      {/* Main Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminUserManagement users={users} />
        <AdminGuideAssignments assignments={guideAssignments} />
        <AdminFacultyCoordinators coordinators={facultyCoordinators} />
        <AdminSchedule events={scheduleEvents} />
      </div>

      {/* Analytics Section */}
      <AdminAnalytics analytics={stats} />
    </div>
  );
};

export default AdminDashboard;
