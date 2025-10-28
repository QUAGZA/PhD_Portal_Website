import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  Download,
  UserCheck,
  TrendingUp,
  Users,
  BookOpen
} from "lucide-react"

export default function GuideAssignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  useEffect(() => {
    // Dummy data for guide assignments
    setAssignments([
      { id: 1, guideName: "Dr. Rajesh Kumar", department: "Computer Science", studentCount: 12, progress: 85, email: "r.kumar@university.edu" },
      { id: 2, guideName: "Dr. Priya Mehta", department: "Electronics", studentCount: 8, progress: 92, email: "p.mehta@university.edu" },
      { id: 3, guideName: "Dr. Amit Singh", department: "Mechanical", studentCount: 10, progress: 78, email: "a.singh@university.edu" },
      { id: 4, guideName: "Dr. Sneha Patel", department: "Civil", studentCount: 6, progress: 88, email: "s.patel@university.edu" },
      { id: 5, guideName: "Dr. Vikram Sharma", department: "Computer Science", studentCount: 9, progress: 80, email: "v.sharma@university.edu" },
      { id: 6, guideName: "Dr. Anjali Desai", department: "Chemical", studentCount: 7, progress: 86, email: "a.desai@university.edu" },
      { id: 7, guideName: "Dr. Rahul Verma", department: "Electronics", studentCount: 11, progress: 75, email: "r.verma@university.edu" },
      { id: 8, guideName: "Dr. Pooja Nair", department: "Computer Science", studentCount: 13, progress: 90, email: "p.nair@university.edu" },
    ])
  }, [])

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.guideName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || assignment.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = ["all", ...new Set(assignments.map((a) => a.department))]
  const totalStudents = assignments.reduce((sum, a) => sum + a.studentCount, 0)
  const avgProgress = assignments.length > 0
    ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length)
    : 0

  const getProgressColor = (progress) => {
    if (progress >= 85) return "text-green-600"
    if (progress >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="p-6 font-[Marcellus]">
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guide Assignments</h1>
        <p className="text-gray-600">Manage research guide student assignments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Guides</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold">{avgProgress}%</p>
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
                placeholder="Search by guide name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
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

      {/* Guide Assignments List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Guide</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Department</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Students</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Avg Progress</th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No guide assignments found
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#B7202E] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {assignment.guideName.split(" ")[1]?.charAt(0)}
                              {assignment.guideName.split(" ")[2]?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{assignment.guideName}</p>
                            <p className="text-sm text-gray-500">Research Guide</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">{assignment.email}</td>
                      <td className="p-4">
                        <Badge variant="outline">{assignment.department}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{assignment.studentCount}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`h-4 w-4 ${getProgressColor(assignment.progress)}`} />
                          <span className={`font-medium ${getProgressColor(assignment.progress)}`}>
                            {assignment.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Students</Button>
                          <Button variant="outline" size="sm">Reassign</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredAssignments.length} of {assignments.length} guide assignments
      </div>
    </div>
  )
}
