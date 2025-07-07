import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalendarDays, Edit } from "lucide-react"
import { SquareArrowOutUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import ScheduleCard from "./ScheduleCard"
const students = [
  { name: "Student 1 Name", progress: 80, attendance: 70, batch: "B3" },
  { name: "Student 2 Name", progress: 80, attendance: 70, batch: "B3" },
  { name: "Student 3 Name", progress: 30, attendance: 70, batch: "B3" },
  { name: "Student 4 Name", progress: 80, attendance: 70, batch: "B3" },
]

const assignments = [
  {
    title: "Assignment 1",
    uploaded: "15/06/2025, 2:36pm",
    deadline: "18/06/2025, 11:59pm",
    status: "Locked",
    submissions: "6/10",
  },
  {
    title: "Assignment 2",
    uploaded: "16/06/2025, 2:36pm",
    deadline: "20/06/2025, 11:59pm",
    status: "Unlocked",
    submissions: "3/10",
  },
  {
    title: "Assignment 1",
    uploaded: "17/06/2025, 2:36pm",
    deadline: "24/06/2025, 11:59pm",
    status: "Unlocked",
    submissions: "1/10",
  },
]

const schedule = [
  { day: "Sun", date: 15, label: "" },
  { day: "Mon", date: 16, label: "Check progress of students", color: "bg-red-300" },
  { day: "Tue", date: 17, label: "Surprise test", color: "bg-orange-300" },
  { day: "Wed", date: 18, label: "Assignment 1 Deadline", color: "bg-blue-400" },
  { day: "Thu", date: 19 },
  { day: "Fri", date: 20, label: "Assignment 2 Deadline", color: "bg-pink-300" },
  { day: "Sat", date: 21 },
]

export default function GuideDashboard() {
  return (
    <div className="p-6 space-y-6 font-[Marcellus]">
      <h2 className="text-2xl font-semibold">
        Welcome, <span className="text-[#B7202E]">Prof. (Educator's Name)</span>
      </h2>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student List */}
        <Card className="max-h-[300px] overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">Student List
              <Link to="/guide/students" className="text-muted-foreground hover:text-black  ">
              <SquareArrowOutUpRight className="h-4 w-4" />
              </Link>
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            {students.map((student, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Progress:{" "}
                    <span className={student.progress < 50 ? "text-red-500" : ""}>
                      {student.progress}%
                    </span>{" "}
                    <br />
                    Attendance: {student.attendance}%
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{`Batch-${student.batch}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="lg:col-span-2 max-h-[300px] overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">Assignments
              <Link to="/guide/assignments" className="text-muted-foreground hover:text-black  ">
              <SquareArrowOutUpRight className="h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((a, idx) => (
              <div
                key={idx}
                className="border rounded p-3 flex justify-between items-start hover:shadow"
              >
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded on {a.uploaded} <br />
                    Deadline {a.deadline} <br />
                    Status - {a.status}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Submissions: {a.submissions}</span>
                  <Edit className="h-4 w-4 ml-1 cursor-pointer hover:text-black" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* My Schedule & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Schedule */}
            <ScheduleCard />
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write to students..."
              className="resize-none min-h-[120px] text-sm"
            />
            <Button className="mt-2 float-right" disabled>
              🔒 Post (coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
