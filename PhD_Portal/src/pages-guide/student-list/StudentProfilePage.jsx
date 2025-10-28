import { useParams } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getStudentProfile } from "@/services/guideDashboardService"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentProfilePage() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        const data = await getStudentProfile(id)
        setStudent(data.student)
        setError(null)
      } catch (err) {
        console.error("Error fetching student profile:", err)
        setError("Failed to load student profile")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStudentProfile()
    }
  }, [id])

  if (loading) {
    return (
      <div className="p-6 space-y-4 font-[Marcellus]">
        <Card>
          <CardHeader className="bg-[#B7202E] text-white p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64 bg-white/20" />
                <Skeleton className="h-4 w-96 bg-white/20" />
                <Skeleton className="h-4 w-80 bg-white/20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="p-6 text-red-600">
        {error || "Student not found"}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 font-[Marcellus]">
      <Card>
        <CardHeader className="bg-[#B7202E] text-white flex items-center gap-4 p-6">
          <div className="w-20 h-20 bg-white rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p>{student.institute}</p>
            <p>{student.department}</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p><strong>Enrollment ID:</strong> {student.enrollmentId}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Email:</strong> {student.primaryEmail}</p>
          </div>
          <div>
            <p><strong>Domain of Research:</strong> {student.domain}</p>
            <p><strong>Topic of Research:</strong> {student.topic}</p>
            <p><strong>Research Status:</strong> {student.researchStatus}</p>
          </div>
          <div className="md:col-span-2">
            <p><strong>Research Description:</strong> {student.researchDescription}</p>
            <p><strong>Bonds with Institute:</strong> {student.bonds}</p>
            {student.scholarship && student.scholarship !== "N/A" && (
              <p><strong>Scholarship:</strong> {student.scholarship}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assignment + Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assignments */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submitted: {student.assignments.filter(a => a.status === "submitted").length}/{student.assignments.length}
            </p>
          </CardHeader>
          <CardContent>
            {student.assignments.length > 0 ? (
              student.assignments.map((a, i) => (
                <div key={i} className="border rounded p-2 my-2">
                  <p className="font-semibold">{a.title}</p>
                  <p>
                    Status:{" "}
                    <span className={a.status === "pending" ? "text-red-500" : "text-green-600"}>
                      {a.status === "pending" ? "Pending" : "Submitted"}
                    </span>
                  </p>
                  <p>Deadline - {a.deadline}</p>
                  {a.submittedAt && <p>Submitted on - {a.submittedAt}</p>}
                  {a.grade !== null && <p>Grade: {a.grade}</p>}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No assignments yet</p>
            )}
          </CardContent>
        </Card>

        {/* Progress Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-28 h-28 mx-auto rounded-full border-[8px] border-green-400 flex items-center justify-center text-xl font-bold text-green-600">
              {student.progress}%
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Course Completed</p>
            <div className="mt-4 text-sm">
              <p>Total Events: {student.attendance.total}</p>
              <p>Events Attended: {student.attendance.attended}</p>
              <p className="font-semibold mt-2">
                Attendance: {student.attendance.percentage}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
