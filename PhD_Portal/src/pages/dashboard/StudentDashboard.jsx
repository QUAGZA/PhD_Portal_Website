import { useSelector } from "react-redux";
import CourseCarousel from "../../components/custom/carousel/CourseCarousel";
import AssignmentCarousel from "@/components/custom/carousel/AssignmentCarousel";
import ProgressChart from "../../components/custom/charts/ProgressChart";
import useRequireAuth from "../../hooks/useRequireAuth";
export default function StudentDashboard() {

  useRequireAuth(["student", "admin"]); 
  
  const {
    studentInfo,
    courses,
    assignments,
    announcements,
    schedule,
    progress,
  } = useSelector((state) => state.studentDashboard);
const sampleCourses = [
  {
    title: "Course 1",
    sem: "Sem 1 - 2025",
    faculty: "SWP",
    credits: 3,
    schedule: "Mon 9-10 am\nWed 12-1 pm\nThurs 2-3 pm",
  },
  {
    title: "Course 2",
    sem: "Sem 1 - 2025",
    faculty: "GSS",
    credits: 2,
    schedule: "Tues 10-11 am",
  },
  {
    title: "Course 3",
    sem: "Sem 1 - 2025",
    faculty: "NHS",
    credits: 3,
    schedule: "Wed 2-3 pm",
  },
  {
    title: "Course 4",
    sem: "Sem 1 - 2025",
    faculty: "JTR",
    credits: 3,
    schedule: "Fri 1-2 pm",
  },
];

const sampleAssignments = [
  {
    title: "ML Project Report",
    course: "Machine Learning",
    dueDate: "2025-07-01",
    faculty: "Dr. SWP",
    description: "Submit the complete project report including code links and observations.",
  },
  {
    title: "DL Lab 2",
    course: "Deep Learning",
    dueDate: "2025-06-28",
    faculty: "Prof. NHS",
    description: "Implement CNN-based image classification using PyTorch.",
  },
  {
    title: "AI Ethics Essay",
    course: "AI & Society",
    dueDate: "2025-07-05",
    faculty: "Prof. GSS",
    description: "Write a 1000-word essay on the ethical implications of autonomous systems.",
  },
];


  return (
    <div className="flex">
      <main className="flex-1 p-6 space-y-10 ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Hello, <span className="text-red-500">{studentInfo?.name || "Student"}</span>!
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 min-h-screen bg-gray-50">
        {/* <!-- My Courses --> */}
        <div className="col-span-12 lg:col-span-8 space-y-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">My Courses</h2>
            <div>
              <CourseCarousel courses={sampleCourses} />
            </div>
          </div>

          {/* <!-- Assignments --> */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Assignments</h2>
            <div>
              <AssignmentCarousel assignments={sampleAssignments} />
            </div>
          </div>

          {/* <!-- Progress --> */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Progress</h2>
            <div className="bg-gray-100 p-3 rounded shadow ">
              {/* <!-- Chart Placeholder --> */}
              <ProgressChart />
            </div>
          </div>
        </div>

        {/* <!-- Announcements --> */}
        <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Announcements</h2>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>Sem 1 Orientation</li>
              <li>Guide Allocation</li>
              <li>DAC Formation</li>
              <li>Conference on Technologies</li>
              <li>Seminar on Comp. Science</li>
            </ul>
          </div>
           {/* <!-- Resources --> */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Resources</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Visit E-Library</li>
              <li>Updated Syllabus</li>
              <li>Course Resources</li>
              <li>Past Question Papers</li>
            </ul>
          </div>
        </div>
      </div>

      </main>
    </div>
  );
}
