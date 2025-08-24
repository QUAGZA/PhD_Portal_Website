
import { Pie, PieChart, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const progressData = [
  { name: "Completed", value: 75 },
  { name: "Remaining", value: 25 },
];

const COLORS = ["#B7202E", "#f2f2f2"];

const modules = [
  {
    title: "Module 1",
    notesLink: "#",
    videosLink: "#",
    extraNotesLink: "#",
  },
  {
    title: "Module 2",
    notesLink: "#",
    videosLink: "#",
    extraNotesLink: "#",
  },
  {
    title: "Module 3",
    notesLink: "#",
    videosLink: "#",
    extraNotesLink: "#",
  },
  {
    title: "Module 4",
    notesLink: "#",
    videosLink: "#",
    extraNotesLink: "#",
  },
];

const AllCourseDetails = () => {

  const navigate=useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 space-y-8">
      <h2 className="text-[22px] font-bold text-black border-b border-red-600 pb-2">
        Operating Systems
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {modules.map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between h-[200px]">
              <div>
                <h3 className="text-[16px] font-bold text-black mb-2">
                  {module.title}
                </h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    Module 1 Notes{" "}
                    <a href={module.notesLink} className="text-blue-600 underline">
                      Download
                    </a>
                  </li>
                  <li>
                    Reference Videos for revision{" "}
                    <a href={module.videosLink} className="text-blue-600 underline">
                      Link
                    </a>
                  </li>
                  <li>
                    Module 1.3 Notes{" "}
                    <a href={module.extraNotesLink} className="text-blue-600 underline">
                      Download
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black text-[13px] cursor-pointer"
                  onClick={() => navigate('/student/courses/details/learning-guides')}
                >
                  More
                </Button>
              </div>

            </div>

          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-[16px] font-bold text-black mb-2">Faculty</h3>
            <p className="text-sm mb-1">Mr. Swapnil Pawar</p>
            <p className="text-sm text-gray-600 mb-3">
              swapnil.pawar@somaiya.edu
            </p>
            <textarea
              placeholder="Write to faculty..."
              className="w-full p-2 border border-gray-400 rounded text-sm mb-2"
            ></textarea>
            <button className="w-full py-1 cursor-pointer bg-[#B7202E] text-white text-sm rounded">
              Send
            </button>
          </div>

          <div className="bg-white border rounded-lg shadow p-4">
            <h3 className="text-[16px] font-bold text-black mb-2">
              Announcements
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>OST 1 scheduled for 20/06/2025</li>
              <li>ISE marks released</li>
              <li>All notes uploaded</li>
              <li>Chapters completed for ESE</li>
              <li>ISE papers shared soon</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h3 className="text-[16px] font-bold text-black mb-4">Progress</h3>

          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <PieChart width={120} height={120}>
                <Pie
                  data={[{ name: "Completed", value: 75 }, { name: "Remaining", value: 25 }]}
                  innerRadius={40}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={5}
                  labelLine={false}

                  label={({ cx, cy }) => (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-red-600"
                    >
                      75%
                    </text>
                  )}
                >
                  <Cell fill="#B7202E" />
                  <Cell fill="#f2f2f2" />
                </Pie>
              </PieChart>
              <p className="text-sm text-gray-600 mt-2">Course Completed</p>
            </div>

            <div className="flex flex-col items-center">
              <PieChart width={120} height={120}>
                <Pie
                  data={[{ name: "Attended", value: 90 }, { name: "Remaining", value: 10 }]}
                  innerRadius={40}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={5}
                  labelLine={false}
                  label={({ cx, cy }) => (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-green-600"
                    >
                      90%
                    </text>
                  )}
                >
                  <Cell fill="#16a34a" />
                  <Cell fill="#f2f2f2" />
                </Pie>
              </PieChart>
              <p className="text-sm text-gray-600 mt-2">Lectures Attended</p>
            </div>
          </div>
        </div>



        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-[16px] font-bold text-black mb-2">Assignments</h3>
          <ul className="text-sm space-y-2">
            <li>
              Exp 1 Process Scheduling -{" "}
              <span className="text-red-600 font-semibold">Pending</span>
            </li>
            <li>
              Exp 2 Disk Scheduling -{" "}
              <span className="text-green-600 font-semibold">Submitted</span>
            </li>
            <li>
              Exp 3 Fragmentation -{" "}
              <span className="text-green-600 font-semibold">Graded</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:hidden">
          <h3 className="text-[16px] font-bold text-black mb-2">
            Announcements
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>OST 1 scheduled for 20/06/2025</li>
            <li>ISE marks released</li>
            <li>All notes uploaded</li>
            <li>Chapters completed for ESE</li>
            <li>ISE papers shared soon</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllCourseDetails;
