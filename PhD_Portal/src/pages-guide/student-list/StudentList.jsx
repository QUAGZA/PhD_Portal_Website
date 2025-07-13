import StudentCard from "./StudentCard.jsx"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useRequireAuth from "../../hooks/useRequireAuth.js"

const students = [
  {
    id: "stu001",
    name: "Student 1 Name",
    email: "abc@somaiya.edu",
    domain: "Computer and Tech",
    progress: 80,
    attendance: 70,
    enrollmentId: "1234567890",
    batch: "Batch-B3",
  },
  {
    id: "stu002",
    name: "Student 2 Name",
    email: "abc@somaiya.edu",
    domain: "Computer and Tech",
    progress: 30,
    attendance: 70,
    enrollmentId: "1234567891",
    batch: "Batch-B3",
  },
  // Add more students...
]

export default function StudentList() {
  useRequireAuth(["guide", "admin"]);
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
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Announcement Box */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Write to students..." className="min-h-[150px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
