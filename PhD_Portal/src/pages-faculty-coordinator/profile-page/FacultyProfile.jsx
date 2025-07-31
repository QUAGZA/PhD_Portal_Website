import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useRequireAuth from "../../hooks/useRequireAuth";

const facultyProfile = {
  name: "Faculty Name",
  title: "Faculty Co-ordinator",
  designation: "Professor at K.J. Somaiya School of Engineering",
  enrollmentId: "1234567890",
  department: "",
  institute: "K.J. Somaiya School of Engineering",
  location: "Vidyavihar - Mumbai",
  contact: {
    landline: "01111111111",
    extension: "1111",
  },
  office: "B218 KJSSE",
  timings: "Mon-Fri : 10 am to 5.30 pm",
  accordions: {
    "INTRODUCTION:": "",
    "EDUCATION:": "",
    "WORK PORTFOLIO:": "",
    "DISCIPLINARY FOCUS:": "",
    "INDUSTRY COLLABORATION PROJECTS:": "",
    "ACHIEVEMENTS & AWARDS:": "",
  },
};

export default function FacultyProfile() {

  useRequireAuth(["faculty-coordinator", "admin"]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-semibold text-red-700">Prof. {facultyProfile.name}</h1>
          <p className="font-medium">{facultyProfile.designation}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium">Share the profile:</span>
            <div className="space-x-2 text-sm">
              <span>🔗</span>
              <span>📘</span>
              <span>📧</span>
              <span>❌</span>
            </div>
          </div>
        </div>

        <div className="text-right space-x-3 mt-2">
          <span className="text-sm font-medium">Save the profile:</span>
          <span>🔖</span>
          <span>📓</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex gap-6">
        <div className="bg-white rounded-lg shadow p-4 w-64 space-y-3">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
            <div className="text-center">
              <p className="font-semibold">{facultyProfile.name}</p>
              <p className="text-green-600">{facultyProfile.title}</p>
            </div>
          </div>
          <div className="text-sm space-y-1">
            <p><strong>Enrollment ID :</strong> {facultyProfile.enrollmentId}</p>
            <p><strong>Department :</strong> {facultyProfile.department || "-"}</p>
            <p><strong>Institute :</strong> {facultyProfile.institute}</p>
            <p><strong>Location :</strong> {facultyProfile.location}</p>
            <p><strong>Contact Details :</strong></p>
            <ul className="ml-3 list-disc">
              <li>Landline No. : {facultyProfile.contact.landline}</li>
              <li>Extension No. : {facultyProfile.contact.extension}</li>
            </ul>
            <p><strong>Office Address:</strong> {facultyProfile.office}</p>
            <p><strong>Timing to visit:</strong><br /> {facultyProfile.timings}</p>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="flex-1 space-y-2">
          <Accordion type="multiple">
            {Object.entries(facultyProfile.accordions).map(([title, content]) => (
              <AccordionItem key={title} value={title}>
                <AccordionTrigger className="bg-gray-200 px-4 py-2 cursor-pointer">{title}</AccordionTrigger>
                <AccordionContent className="bg-white px-4 py-2 ">{content || "No data provided yet."}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Announcements Box */}

      </div>
    </div>
  );
}
