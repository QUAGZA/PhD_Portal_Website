import GuideAssignmentCard from "./GuideAssignmentCard.jsx"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const guideAssignments = [
  {
    id: "1",
    title: "Experiment 1 - Process Scheduling",
    deadline: "31/05/2025",
    attachments: [{ name: "Exp_1.pdf", url: "#" }],
    submissionsCount: 9,
    totalStudents: 10,
  },
  {
    id: "2",
    title: "Experiment 2 - Disk Scheduling",
    deadline: "31/05/2025",
    attachments: [{ name: "Exp_2.pdf", url: "#" }, { name: "Sheet.xls", url: "#" }],
    submissionsCount: 6,
    totalStudents: 10,
  },
  // more...
]

export default function GuideAssignmentList() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 font-[Marcellus]">
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Assignments</h2>
          <button className="text-red-500 border border-red-500 px-3 py-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors">
            + Create
          </button>
        </div>
        {guideAssignments.map((assignment) => (
          <GuideAssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>

      {/* Announcement box */}
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
