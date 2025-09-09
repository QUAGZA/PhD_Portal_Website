import GuideAssignmentCard from "./GuideAssignmentCard";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";

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
    attachments: [
      { name: "Exp_2.pdf", url: "#" },
      { name: "Sheet.xls", url: "#" },
    ],
    submissionsCount: 6,
    totalStudents: 10,
  },
];

export default function GuideAssignmentList() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Assignments
                </h1>
                <p className="text-gray-600">
                  Manage and track student assignments
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            <div>
              {guideAssignments.map((assignment) => (
                <GuideAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <Megaphone className="w-5 h-5 mr-2 text-red-500" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write to students..."
                  className="min-h-[150px] border-gray-200 focus:border-red-300 focus:ring-red-200 resize-none"
                />
                <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
