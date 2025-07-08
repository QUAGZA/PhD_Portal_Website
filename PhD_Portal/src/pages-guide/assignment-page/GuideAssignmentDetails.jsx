import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function GuideAssignmentDetails() {
  const { id } = useParams()
  // Dummy data for now
  const assignment = {
    title: "Experiment 2 - Disk Scheduling",
    deadline: "Saturday, 31/05/2025, 11:59 pm",
    timeRemaining: "1 day 2 hours",
    lastModified: "Saturday, 31/05/2025, 09:59 pm",
    attachments: [
      { name: "Exp2_WriteUp.docx", url: "#" },
      { name: "ReferenceMaterial.pdf", url: "#" },
    ],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    submissions: [
      {
        studentName: "Student 1 Name",
        enrollmentNo: "1234567890",
        attachment: { name: "Exp2_WriteUp.docx", url: "#" },
        grade: 22,
        maxGrade: 25,
      },
      {
        studentName: "Student 2 Name",
        enrollmentNo: "1234567890",
        attachment: { name: "Exp2_WriteUp.docx", url: "#" },
        grade: null,
      },
    ],
    questions: [
      {
        student: "Student Name",
        question: "Lorem Ipsum is simply dummy text of the printing.",
        answer: "Lorem Ipsum is simply dummy text of the printing.",
      },
      {
        student: "Student Name",
        question: "Lorem Ipsum is simply dummy text of the printing.",
        answer: null,
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-6 font-[Marcellus]">
      {/* Left - Assignment Details */}
      <div className="lg:col-span-4 space-y-4">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Assignments</CardTitle>
            <button className="text-blue-600 border px-2 py-1 rounded">✎ Edit</button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <p><strong>Deadline:</strong> {assignment.deadline}</p>
              <p><strong>Time Remaining:</strong> {assignment.timeRemaining}</p>
              <p><strong>Last Modified:</strong> {assignment.lastModified}</p>
              <p><strong>Attachments:</strong>
                {assignment.attachments.map((a, i) => (
                  <a key={i} href={a.url} className="text-blue-500 ml-2" target="_blank" rel="noreferrer">{a.name}</a>
                ))}
              </p>
              <div className="col-span-2">
                <strong>Description:</strong>
                <p className="mt-1">{assignment.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions {assignment.submissions.length}/10</CardTitle>
          </CardHeader>
          <CardContent>
            {assignment.submissions.map((s, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <p><strong>{s.studentName}</strong> &nbsp; Enrollment No.: {s.enrollmentNo}</p>
                <p>
                  Attachments:&nbsp;
                  <a href={s.attachment.url} className="text-blue-500">{s.attachment.name}</a>
                </p>
                {s.grade != null ? (
                  <p>Grade {s.grade}/{s.maxGrade}</p>
                ) : (
                  <button className="text-blue-600 mt-1">Give Grade</button>
                )}
                <Textarea placeholder="+ Comment" className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right - Q&A Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Q & A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm overflow-y-auto max-h-[calc(100vh-150px)]">
            {assignment.questions.map((q, idx) => (
              <div key={idx} className="border-b pb-2">
                <p><strong>{q.student}</strong></p>
                <p className="text-gray-600">(Question) {q.question}</p>
                {q.answer ? (
                  <p className="text-green-700">(Answer) {q.answer}</p>
                ) : (
                  <button className="text-blue-600">↪ Reply</button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
