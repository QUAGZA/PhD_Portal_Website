import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Download, Users, TrendingUp } from "lucide-react"

export default function FacultyStudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBatch, setFilterBatch] = useState("all")
  const [filterGuide, setFilterGuide] = useState("all")

  // Dummy data for testing
  useEffect(() => {
    const dummyStudents = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@university.edu",
        batch: "2023",
        guideName: "Dr. Smith",
        progress: 85,
        attendance: 92,
        enrollmentNumber: "PHD2023001",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@university.edu",
        batch: "2024",
        guideName: "Dr. Johnson",
        progress: 78,
        attendance: 88,
        enrollmentNumber: "PHD2024002",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@university.edu",
        batch: "2023",
        guideName: "Dr. Smith",
        progress: 92,
        attendance: 95,
        enrollmentNumber: "PHD2023003",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@university.edu",
        batch: "2024",
        guideName: "Dr. Williams",
        progress: 88,
        attendance: 90,
        enrollmentNumber: "PHD2024004",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@university.edu",
        batch: "2022",
        guideName: "Dr. Johnson",
        progress: 95,
        attendance: 93,
        enrollmentNumber: "PHD2022005",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 6,
        name: "Sarah Martinez",
        email: "sarah.martinez@university.edu",
        batch: "2023",
        guideName: "Dr. Williams",
        progress: 82,
        attendance: 87,
        enrollmentNumber: "PHD2023006",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 7,
        name: "Robert Garcia",
        email: "robert.garcia@university.edu",
        batch: "2024",
        guideName: "Dr. Smith",
        progress: 75,
        attendance: 85,
        enrollmentNumber: "PHD2024007",
        department: "Computer Science",
        status: "Active"
      },
      {
        id: 8,
        name: "Linda Anderson",
        email: "linda.anderson@university.edu",
        batch: "2022",
        guideName: "Dr. Johnson",
        progress: 90,
        attendance: 94,
        enrollmentNumber: "PHD2022008",
        department: "Computer Science",
        status: "Active"
      }
    ]
    setStudents(dummyStudents)
  }, [])

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBatch = filterBatch === "all" || student.batch === filterBatch
    const matchesGuide = filterGuide === "all" || student.guideName === filterGuide
    return matchesSearch && matchesBatch && matchesGuide
  })

  const batches = ["all", ...new Set(students.map((s) => s.batch))]
  const guides = ["all", ...new Set(students.map((s) => s.guideName))]

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-green-500"
    if (progress >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getAttendanceBadge = (attendance) => {
    if (attendance >= 90) return "bg-green-100 text-green-800"
    if (attendance >= 75) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="p-6 font-[Marcellus]">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Students</h1>
        <p className="text-gray-600">
          Department-wide student overview and management
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-[#B7202E]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold">
                {students.length > 0
                  ? Math.round(
                      students.reduce((sum, s) => sum + s.progress, 0) /
                        students.length
                    )
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Guides</p>
              <p className="text-2xl font-bold">{guides.length - 1}</p>
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
                placeholder="Search by name, email, or enrollment number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
              >
                <option value="all">All Batches</option>
                {batches.slice(1).map((batch) => (
                  <option key={batch} value={batch}>
                    Batch {batch}
                  </option>
                ))}
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

      {/* Student List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Student
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Enrollment No.
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Batch
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Guide
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Progress
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Attendance
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {student.enrollmentNumber}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{student.batch}</Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {student.guideName}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                student.progress
                              )}`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-700">
                            {student.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getAttendanceBadge(student.attendance)}>
                          {student.attendance}%
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-green-100 text-green-800">
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Showing results count */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  )
}
