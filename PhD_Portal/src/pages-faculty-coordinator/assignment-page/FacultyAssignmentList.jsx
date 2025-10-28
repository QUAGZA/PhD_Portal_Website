import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp
} from "lucide-react"

export default function FacultyAssignmentList() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGuide, setFilterGuide] = useState("all")

  // Dummy data for testing
  useEffect(() => {
    const dummyAssignments = [
      {
        id: 1,
        title: "Research Methodology Paper",
        guideName: "Dr. Smith",
        uploadedDate: "2024-01-15",
        deadline: "2024-02-15",
        status: "Active",
        totalStudents: 12,
        submissions: 8,
        pending: 4,
        description: "Write a comprehensive paper on research methodologies"
      },
      {
        id: 2,
        title: "Literature Review",
        guideName: "Dr. Johnson",
        uploadedDate: "2024-01-20",
        deadline: "2024-02-20",
        status: "Active",
        totalStudents: 15,
        submissions: 12,
        pending: 3,
        description: "Complete literature review for your research topic"
      },
      {
        id: 3,
        title: "Proposal Draft",
        guideName: "Dr. Williams",
        uploadedDate: "2024-01-10",
        deadline: "2024-01-25",
        status: "Closed",
        totalStudents: 10,
        submissions: 10,
        pending: 0,
        description: "Submit first draft of research proposal"
      },
      {
        id: 4,
        title: "Data Collection Plan",
        guideName: "Dr. Smith",
        uploadedDate: "2024-01-25",
        deadline: "2024-03-01",
        status: "Active",
        totalStudents: 12,
        submissions: 5,
        pending: 7,
        description: "Outline your data collection methodology"
      },
      {
        id: 5,
        title: "Chapter 1 Draft",
        guideName: "Dr. Johnson",
        uploadedDate: "2024-02-01",
        deadline: "2024-03-15",
        status: "Active",
        totalStudents: 15,
        submissions: 3,
        pending: 12,
        description: "Submit first chapter of your thesis"
      },
      {
        id: 6,
        title: "Conference Paper",
        guideName: "Dr. Williams",
        uploadedDate: "2023-12-15",
        deadline: "2024-01-15",
        status: "Closed",
        totalStudents: 10,
        submissions: 9,
        pending: 1,
        description: "Prepare paper for upcoming conference"
      },
      {
        id: 7,
        title: "Ethics Approval Form",
        guideName: "Dr. Smith",
        uploadedDate: "2024-01-18",
        deadline: "2024-02-10",
        status: "Active",
        totalStudents: 12,
        submissions: 10,
        pending: 2,
        description: "Complete and submit ethics approval documentation"
      }
    ]
    setAssignments(dummyAssignments)
  }, [])

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus
    const matchesGuide = filterGuide === "all" || assignment.guideName === filterGuide
    return matchesSearch && matchesStatus && matchesGuide
  })

  const guides = ["all", ...new Set(assignments.map((a) => a.guideName))]

  const getStatusBadge = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const getCompletionColor = (submissions, total) => {
    const percentage = (submissions / total) * 100
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Calculate stats
  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter((a) => a.status === "Active").length
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0)
  const totalPending = assignments.reduce((sum, a) => sum + a.pending, 0)
  const avgCompletionRate = assignments.length > 0
    ? Math.round(
        assignments.reduce(
          (sum, a) => sum + (a.submissions / a.totalStudents) * 100,
          0
        ) / assignments.length
      )
    : 0

  if (loading) {
    return (
      <div className="p-6 font-[Marcellus]">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Assignments
        </h1>
        <p className="text-gray-600">
          Department-wide assignment overview and tracking
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold">{totalAssignments}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">{activeAssignments}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold">{totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-[#B7202E]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold">{avgCompletionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assignments by title or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterGuide}
                onChange={(e) => setFilterGuide(e.target.value)}
              >
                <option value="all">All Guides</option>
                {guides.slice(1).map((guide) => (
                  <option key={guide} value={guide}>
                    {guide}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No assignments found
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const completionRate =
              (assignment.submissions / assignment.totalStudents) * 100
            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge className={getStatusBadge(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Guide: {assignment.guideName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Uploaded: {new Date(assignment.uploadedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">
                          <span className="font-semibold">
                            {assignment.submissions}
                          </span>{" "}
                          / {assignment.totalStudents} submitted
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm">
                          <span className="font-semibold text-red-600">
                            {assignment.pending}
                          </span>{" "}
                          pending
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getCompletionColor(
                              assignment.submissions,
                              assignment.totalStudents
                            )}`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Showing results count */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredAssignments.length} of {assignments.length} assignments
      </div>
    </div>
  )
}
