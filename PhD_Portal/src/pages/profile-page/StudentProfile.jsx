import { useState } from "react"
import studentData from "./sampleStudentData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User, Calendar, Phone, Mail,
  GraduationCap, BookOpen, FileText
} from "lucide-react"
import useRequireAuth from "../../hooks/useRequireAuth"
export default function StudentProfile() {
  useRequireAuth(["student", "admin"]);
  const [activeSection, setActiveSection] = useState("personal")

  const { profile, personalDetails, educationalDetails, programDetails } = studentData

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="flex">
        <div className="flex-1 space-y-4 lg:pr-16">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Student Profile
          </h1>

          {/* Profile Card */}
          <div className="top-4 z-10">
            <Card className="w-full p-0 overflow-hidden border border-gray-300 border-b-4 border-b-gray-300 rounded-md shadow">
              <div className="bg-[#B7202E] text-white p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-24 h-24 border-4 border-white bg-white">
                    <AvatarImage src={profile.avatar} alt="Profile" />
                    <AvatarFallback className="bg-blue-500 text-white text-2xl">
                      {profile.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {profile.name}
                    </h2>
                    <p className="text-lg mb-1">{profile.institution}</p>
                    <p className="text-base mb-0">{profile.course}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white text-black px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-black" />
                    <span>{profile.enrollmentId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>{profile.dob}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-black" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-black" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-4">
            <div className="col-span-3 space-y-6">
              {activeSection === "personal" && (
                <section className="w-inherit pr-4">
                  <Card className="border border-gray-300 border-b-4 border-b-gray-300 rounded-md">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div><label>Father's Name</label><p>{personalDetails.fatherName}</p></div>
                        <div><label>Mother's Name</label><p>{personalDetails.motherName}</p></div>
                        <div><label>Gender</label><p>{personalDetails.gender}</p></div>
                        <div><label>Marital Status</label><p>{personalDetails.maritalStatus}</p></div>
                        <div><label>Aadhar Number</label><p>{personalDetails.aadhar}</p></div>
                        <div><label>Nearest Railway Station</label><p>{personalDetails.railwayStation}</p></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label>Residential Address</label>
                          <div>{personalDetails.residentialAddress.map((line, i) => <p key={i}>{line}</p>)}</div>
                        </div>
                        <div>
                          <label>Permanent Address</label>
                          <div>{personalDetails.permanentAddress.map((line, i) => <p key={i}>{line}</p>)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div><label>Mobile Number</label><p>{personalDetails.contacts.mobile}</p></div>
                        <div><label>Alternate Mobile</label><p>{personalDetails.contacts.alternateMobile}</p></div>
                        <div><label>Primary Email</label><p>{personalDetails.contacts.primaryEmail}</p></div>
                        <div><label>Alternate Email</label><p>{personalDetails.contacts.alternateEmail}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {activeSection === "educational" && (
                <section className="w-inherit pr-4">
                  <Card className="border border-gray-300 border-b-4 border-b-gray-300 rounded-md">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5" />
                        <span>Educational Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3>Undergraduate Or Equivalent</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div><p>Degree Name</p><p>{educationalDetails.undergraduate.degree}</p></div>
                          <div><p>Institute Name</p><p>{educationalDetails.undergraduate.institute}</p></div>
                          <div><p>University Name</p><p>{educationalDetails.undergraduate.university}</p></div>
                          <div><p>Year Of Passing</p><p>{educationalDetails.undergraduate.yearOfPassing}</p></div>
                        </div>
                      </div>

                      <div>
                        <h3>Postgraduate Or Equivalent</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div><p>Degree Name</p><p>{educationalDetails.postgraduate.degree}</p></div>
                          <div><p>Institute Name</p><p>{educationalDetails.postgraduate.institute}</p></div>
                          <div><p>University Name</p><p>{educationalDetails.postgraduate.university}</p></div>
                          <div><p>Year Of Passing</p><p>{educationalDetails.postgraduate.yearOfPassing}</p></div>
                        </div>
                      </div>

                      <div>
                        <h3>Employment</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div><p>Designation</p><p>{educationalDetails.employment.designation}</p></div>
                          <div><p>Organization</p><p>{educationalDetails.employment.organization}</p></div>
                          <div><p>Duration</p><p>{educationalDetails.employment.duration}</p></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {activeSection === "program" && (
                <section className="w-inherit pr-4">
                  <Card className="border border-gray-300 border-b-4 border-b-gray-300 rounded-md">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Program Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div><label>Department</label><p>{programDetails.department}</p></div>
                        <div><label>Year of Admission</label><p>{programDetails.admissionYear}</p></div>
                        <div><label>Current Semester</label><p>{programDetails.semester}</p></div>
                        <div><label>Guide Name</label><p>{programDetails.guideName}</p></div>
                        <div><label>Guide Email</label><p>{programDetails.guideEmail}</p></div>
                        <div>
                          <label>Status</label>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {programDetails.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div><label>Domain of Research</label><p>{programDetails.domain}</p></div>
                        <div><label>Topic of Research</label><p>{programDetails.topic}</p></div>
                      </div>

                      <div>
                        <label>Research Description</label>
                        <p>{programDetails.researchDescription}</p>
                      </div>

                      <div>
                        <label>Bonds with Institute</label>
                        <p>{programDetails.bonds}</p>
                      </div>

                      <div>
                        <label>Scholarship</label>
                        <p>{programDetails.scholarship}</p>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="h-64 col-span-1 bg-white shadow-lg border border-gray-300 border-b-4 border-b-gray-300 rounded-md overflow-auto">
              <div className="p-4">
                <nav className="space-y-2">
                  <Button variant="ghost" className={`w-full justify-start ${activeSection === "personal" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`} onClick={() => setActiveSection("personal")}>
                    <User className={`w-4 h-4 mr-2 ${activeSection === "personal" ? "text-[#ED1C24]" : "text-black"}`} />
                    Personal Details
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start ${activeSection === "educational" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`} onClick={() => setActiveSection("educational")}>
                    <GraduationCap className={`w-4 h-4 mr-2 ${activeSection === "educational" ? "text-[#ED1C24]" : "text-black"}`} />
                    Educational Details
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start ${activeSection === "program" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`} onClick={() => setActiveSection("program")}>
                    <BookOpen className={`w-4 h-4 mr-2 ${activeSection === "program" ? "text-[#ED1C24]" : "text-black"}`} />
                    Program Details
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
