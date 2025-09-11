import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  MapPin,
  User,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [facultyCoordinators, setFacultyCoordinators] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalGuides: 0,
    totalFacultyCoordinators: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for faculty coordinators
  const mockFacultyCoordinators = [
    {
      _id: "1",
      email: "john.smith@university.edu",
      personalDetails: {
        firstName: "Dr. John",
        lastName: "Smith",
        title: "Professor",
      },
      programDetails: {
        department: "Computer Science",
        institute: "College of Engineering",
      },
      createdAt: "2023-01-15T10:30:00.000Z",
      status: "Active",
    },
    {
      _id: "2",
      email: "maria.garcia@university.edu",
      personalDetails: {
        firstName: "Dr. Maria",
        lastName: "Garcia",
        title: "Associate Professor",
      },
      programDetails: {
        department: "Electrical Engineering",
        institute: "College of Engineering",
      },
      createdAt: "2023-02-20T14:15:00.000Z",
      status: "Active",
    },
    {
      _id: "3",
      email: "david.wilson@university.edu",
      personalDetails: {
        firstName: "Dr. David",
        lastName: "Wilson",
        title: "Professor",
      },
      programDetails: {
        department: "Mechanical Engineering",
        institute: "College of Engineering",
      },
      createdAt: "2023-03-10T09:45:00.000Z",
      status: "Active",
    },
  ];

  // Mock data for schedule events
  const mockScheduleEvents = [
    {
      _id: "1",
      title: "Faculty Meeting",
      description: "Monthly faculty coordination meeting",
      date: "2024-01-20",
      time: "10:00 AM",
      duration: "2 hours",
      location: "Conference Room A",
      type: "Meeting",
      attendees: ["Dr. John Smith", "Dr. Maria Garcia", "Dr. David Wilson"],
      status: "Scheduled",
    },
    {
      _id: "2",
      title: "PhD Defense - Alice Johnson",
      description: "PhD dissertation defense",
      date: "2024-01-22",
      time: "2:00 PM",
      duration: "3 hours",
      location: "Auditorium B",
      type: "Defense",
      attendees: ["Dr. John Smith", "External Examiner"],
      status: "Scheduled",
    },
    {
      _id: "3",
      title: "Research Proposal Review",
      description: "Review of new research proposals",
      date: "2024-01-25",
      time: "9:00 AM",
      duration: "4 hours",
      location: "Conference Room C",
      type: "Review",
      attendees: ["Dr. Maria Garcia", "Dr. David Wilson"],
      status: "Scheduled",
    },
    {
      _id: "4",
      title: "Admission Committee Meeting",
      description: "Review new PhD applications",
      date: "2024-01-28",
      time: "11:00 AM",
      duration: "3 hours",
      location: "Conference Room A",
      type: "Committee",
      attendees: ["Dr. John Smith", "Dr. Maria Garcia"],
      status: "Scheduled",
    },
  ];

  // Mock stats data
  const mockStats = {
    totalUsers: 1245,
    totalStudents: 890,
    totalGuides: 125,
    totalFacultyCoordinators: 15,
    assignedStudents: 678,
    unassignedStudents: 212,
  };

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real implementation, these would be actual API calls
        setTimeout(() => {
          setFacultyCoordinators(mockFacultyCoordinators);
          setScheduleEvents(mockScheduleEvents);
          setStats(mockStats);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventTypeColor = (type) => {
    const colors = {
      Meeting: "bg-blue-100 text-blue-800",
      Defense: "bg-green-100 text-green-800",
      Review: "bg-orange-100 text-orange-800",
      Committee: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800",
      Scheduled: "bg-blue-100 text-blue-800",
      Completed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#B7202E]" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.personalDetails?.firstName || "Administrator"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-[#B7202E] hover:bg-[#A01B26]" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.assignedStudents} assigned, {stats.unassignedStudents} unassigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guides</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuides}</div>
            <p className="text-xs text-muted-foreground">
              Active research guides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Coordinators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFacultyCoordinators}</div>
            <p className="text-xs text-muted-foreground">
              Department coordinators
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Coordinators Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#B7202E]" />
                Faculty Coordinators
              </CardTitle>
              <CardDescription>
                Manage department faculty coordinators
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facultyCoordinators.map((coordinator) => (
                <TableRow key={coordinator._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#B7202E] rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {coordinator.personalDetails?.firstName?.charAt(0)}
                          {coordinator.personalDetails?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {coordinator.personalDetails?.firstName}{" "}
                          {coordinator.personalDetails?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {coordinator.personalDetails?.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{coordinator.email}</TableCell>
                  <TableCell>{coordinator.programDetails?.department}</TableCell>
                  <TableCell>{coordinator.programDetails?.institute}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(coordinator.status)}>
                      {coordinator.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(coordinator.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#B7202E]" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>
                Important meetings and events
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleEvents.map((event) => (
              <div
                key={event._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time} ({event.duration})
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        <span>Attendees: {event.attendees.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
