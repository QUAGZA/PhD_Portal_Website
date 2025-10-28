import StudentCard from "./StudentCard.jsx"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getAssignedStudents } from "@/services/guideDashboardService"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock } from "lucide-react"

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const data = await getAssignedStudents()
        setStudents(data.students || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 font-[Marcellus]">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 mb-4" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 font-[Marcellus]">
      {/* Student Cards */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl">Student List</CardTitle>
            {/* Optional filter button */}
            <button className="text-gray-500 hover:text-black">🔍</button>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto pr-2">
            {error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No students assigned yet
              </p>
            ) : (
              students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcement Box */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write to students..."
              className="min-h-[150px]"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <Button
              disabled
              className="w-full bg-gray-300 text-gray-500 hover:bg-gray-300 gap-2"
            >
              <Lock className="h-4 w-4" />
              Post (coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
