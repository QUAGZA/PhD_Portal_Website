import { useParams } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const dummyStudents = {
  stu001: {
    name: "Mr. Swayam Sanjay Vernekar",
    dob: "24/06/2005",
    id: "1620231407",
    phone: "1234567890",
    email: "swayam.vernekar@somaiya.edu",
    domain: "Computer and Technology",
    topic: "Computer and Technology",
    researchStatus: "Undergoing",
    researchDesc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    bond:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    assignments: [
      {
        title: "Experiment 1 - Process Scheduling",
        status: "Pending",
        deadline: "31/05/2025",
      },
      {
        title: "Experiment 2 - Process Scheduling",
        status: "Submitted",
        deadline: "31/05/2025",
      },
    ],
    progress: 80,
    lectures: { conducted: 20, attended: 8 },
  },
  // Add more mock students...
}

export default function StudentProfilePage() {
  const { id } = useParams()
  const student = dummyStudents[id]

  if (!student) return <div className="p-6 text-red-600">Student not found.</div>

  return (
    <div className="p-6 space-y-4 font-[Marcellus]">
      <Card>
        <CardHeader className="bg-[#B7202E] text-white flex items-center gap-4 p-6">
          <div className="w-20 h-20 bg-white rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p>K. J. Somaiya School Of Engineering</p>
            <p>Second Year B.Tech Computer Engineering</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p><strong>Enrollment ID:</strong> {student.id}</p>
            <p><strong>DOB:</strong> {student.dob}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Email:</strong> {student.email}</p>
          </div>
          <div>
            <p><strong>Domain of Research:</strong> {student.domain}</p>
            <p><strong>Topic of Research:</strong> {student.topic}</p>
            <p><strong>Research Status:</strong> ({student.researchStatus})</p>
          </div>
          <div className="md:col-span-2">
            <p><strong>Research Description:</strong> {student.researchDesc}</p>
            <p><strong>Bonds with Institute:</strong> {student.bond}</p>
          </div>
        </CardContent>
      </Card>

      {/* Assignment + Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assignments */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <p className="text-sm text-muted-foreground">Submitted: 5/7</p>
          </CardHeader>
          <CardContent>
            {student.assignments.map((a, i) => (
              <div key={i} className="border rounded p-2 my-2">
                <p className="font-semibold">{a.title}</p>
                <p>Status: <span className={a.status === "Pending" ? "text-red-500" : "text-green-600"}>{a.status}</span></p>
                <p>Deadline - {a.deadline}</p>
              </div>
            ))}
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
              <p>
                Lectures Conducted: {student.lectures.conducted}
              </p>
              <p>
                Lectures Attended: {student.lectures.attended}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
