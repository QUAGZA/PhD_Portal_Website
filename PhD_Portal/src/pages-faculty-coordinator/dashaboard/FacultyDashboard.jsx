import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScheduleCard from "./ScheduleCard";
import useRequireAuth from "../../hooks/useRequireAuth";

const students = [
  { name: "Student 1 Name", progress: 80, attendance: 70, batch: "B3" },
  { name: "Student 2 Name", progress: 80, attendance: 70, batch: "B3" },
  { name: "Student 3 Name", progress: 30, attendance: 70, batch: "B3" },
  { name: "Student 4 Name", progress: 80, attendance: 70, batch: "B3" },
];

const guides = [
  { name: "Guide 1 Name", progress: 80, batch: "B3" },
  { name: "Guide 2 Name", progress: 80, batch: "B3" },
  { name: "Guide 3 Name", progress: 30, batch: "B3" },
  { name: "Guide 4 Name", progress: 80, batch: "B3" },
];

export default function FacultyDashboard() {
  
  useRequireAuth(["faculty-coordinator", "admin"]); 

  return (
    <div className="p-6 space-y-6 font-[Marcellus]">
      <h2 className="text-2xl font-semibold">
        Welcome, <span className="text-[#B7202E]">Faculty Co-ordinator Name</span>
      </h2>

      {/* Top Grid */}
      <div className="flex justify-around w-full gap-6">

        <Card className="flex-1 max-h-[300px] overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Student List
              <Link to="/guide/students" className="text-muted-foreground hover:text-black">
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            {students.map((student, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Progress:{" "}
                    <span className={student.progress < 50 ? "text-red-500" : ""}>
                      {student.progress}%
                    </span>
                    <br />
                    Attendance: {student.attendance}%
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{`Batch-${student.batch}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex-1 max-h-[300px] overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Guide List
              <Link to="/guide/guides" className="text-muted-foreground hover:text-black">
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{guide.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Progress:{" "}
                    <span className={guide.progress < 50 ? "text-red-500" : ""}>
                      {guide.progress}%
                    </span>
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{`Batch-${guide.batch}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>


      {/* My Schedule & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScheduleCard />
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
  );
}
