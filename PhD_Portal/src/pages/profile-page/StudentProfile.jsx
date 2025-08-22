import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  FileText,
  Loader2,
} from "lucide-react";
import userService from "../../services/userService";

export default function StudentProfile() {
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserProfile();

        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          throw new Error("No profile data returned");
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        if (err.response && err.response.status === 401) {
          setError(
            "You are not logged in. Please log in to view your profile.",
          );
        } else {
          setError("Failed to load profile data. Please try again later.");
        }

        // Use mock data for development/testing purposes
        // Comment this out or remove in production
        // setUserData({
        //   email: "student@example.com",
        //   personalDetails: {
        //     title: "Mr.",
        //     firstName: "John",
        //     lastName: "Doe",
        //     gender: "Male",
        //     maritalStatus: "Single",
        //     contacts: {
        //       mobile: "9876543210",
        //       primaryEmail: "student@example.com",
        //     },
        //   },
        //   programDetails: {
        //     rollNumber: "PHD2023001",
        //     department: "Computer Science",
        //     institute: "K. J. Somaiya School Of Engineering",
        //     enrollmentYear: "2023",
        //     semester: "2",
        //     guideName: "Dr. Jane Smith",
        //     status: "Active",
        //   },
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#B7202E]" />
          <h2 className="mt-4 text-xl font-medium">Loading profile data...</h2>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Error Loading Profile
          </h3>
          <p className="mt-2 text-gray-600">
            {error || "Failed to load user data"}
          </p>
          <Button
            className="mt-4 bg-[#B7202E] hover:bg-[#801721]"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Format user data for display
  // Create a profile object from user data
  const {
    personalDetails = {},
    academicQualifications = { undergraduate: [], postgraduate: [] },
    employmentDetails = [],
    programDetails = {},
    email = "",
  } = userData || {};

  // Create a profile object from scattered fields to use in the profile card
  const profile = {
    name: personalDetails
      ? `${personalDetails.title || ""} ${personalDetails.firstName || ""} ${personalDetails.middleName || ""} ${personalDetails.lastName || ""}`.trim()
      : "Student Name",
    avatar: "", // Your schema doesn't have avatar
    initials: personalDetails
      ? `${personalDetails.firstName?.[0] || ""}${personalDetails.lastName?.[0] || ""}`
      : "SN",
    institution:
      programDetails?.institute || "K. J. Somaiya School Of Engineering",
    course: "Ph.D Program", // Default or you can construct from other fields
    enrollmentId: programDetails?.rollNumber || "",
    dob: "N/A", // Your schema doesn't have dob
    phone: personalDetails?.contacts?.mobile || "N/A",
    email: email || personalDetails?.contacts?.primaryEmail || "N/A",
  };

  // Format educational details for display
  const educationalDetails = {
    undergraduate: academicQualifications?.undergraduate?.[0] || {
      degree: "N/A",
      institute: "N/A",
      university: "N/A",
      yearOfPassing: "N/A",
    },
    postgraduate: academicQualifications?.postgraduate?.[0] || {
      degree: "N/A",
      institute: "N/A",
      university: "N/A",
      yearOfPassing: "N/A",
    },
    employment: employmentDetails?.[0] || {
      designation: "N/A",
      organization: "N/A",
      duration: "N/A",
    },
  };

  // Now get the formatted residential and permanent addresses
  const residentialAddress = personalDetails
    ? [
        personalDetails.addressLine1,
        personalDetails.addressLine2,
        `${personalDetails.district}, ${personalDetails.state}, ${personalDetails.pinCode}`,
      ].filter(Boolean)
    : ["N/A"];

  const permanentAddress = personalDetails
    ? [
        personalDetails.permanentAddressLine1,
        personalDetails.permanentAddressLine2,
        `${personalDetails.permanentDistrict}, ${personalDetails.permanentState}, ${personalDetails.permanentPinCode}`,
      ].filter(Boolean)
    : ["N/A"];

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
                    <span>{profile.enrollmentId || "N/A"}</span>
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
                        <div>
                          <label>Father's Name</label>
                          <p>{personalDetails?.fatherName || "N/A"}</p>
                        </div>
                        <div>
                          <label>Mother's Name</label>
                          <p>{personalDetails?.motherName || "N/A"}</p>
                        </div>
                        <div>
                          <label>Gender</label>
                          <p>{personalDetails?.gender || "N/A"}</p>
                        </div>
                        <div>
                          <label>Marital Status</label>
                          <p>{personalDetails?.maritalStatus || "N/A"}</p>
                        </div>
                        <div>
                          <label>Aadhar Number</label>
                          <p>{personalDetails?.aadhar || "N/A"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label>Residential Address</label>
                          <div>
                            {residentialAddress.map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label>Permanent Address</label>
                          <div>
                            {permanentAddress.map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label>Mobile Number</label>
                          <p>{personalDetails?.contacts?.mobile || "N/A"}</p>
                        </div>
                        <div>
                          <label>Alternate Mobile</label>
                          <p>
                            {personalDetails?.contacts?.alternateMobile ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <label>Primary Email</label>
                          <p>
                            {personalDetails?.contacts?.primaryEmail ||
                              email ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <label>Alternate Email</label>
                          <p>
                            {personalDetails?.contacts?.alternateEmail || "N/A"}
                          </p>
                        </div>
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
                          <div>
                            <p>Degree Name</p>
                            <p>{educationalDetails.undergraduate.degree}</p>
                          </div>
                          <div>
                            <p>Institute Name</p>
                            <p>{educationalDetails.undergraduate.institute}</p>
                          </div>
                          <div>
                            <p>University Name</p>
                            <p>{educationalDetails.undergraduate.university}</p>
                          </div>
                          <div>
                            <p>Year Of Passing</p>
                            <p>
                              {educationalDetails.undergraduate.yearOfPassing}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3>Postgraduate Or Equivalent</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <p>Degree Name</p>
                            <p>{educationalDetails.postgraduate.degree}</p>
                          </div>
                          <div>
                            <p>Institute Name</p>
                            <p>{educationalDetails.postgraduate.institute}</p>
                          </div>
                          <div>
                            <p>University Name</p>
                            <p>{educationalDetails.postgraduate.university}</p>
                          </div>
                          <div>
                            <p>Year Of Passing</p>
                            <p>
                              {educationalDetails.postgraduate.yearOfPassing}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3>Employment</h3>
                        {employmentDetails && employmentDetails.length > 0 ? (
                          employmentDetails.map((job, index) => (
                            <div
                              key={index}
                              className="grid md:grid-cols-2 gap-6 text-sm mb-4"
                            >
                              <div>
                                <p>Designation</p>
                                <p>{job.designation || "N/A"}</p>
                              </div>
                              <div>
                                <p>Organization</p>
                                <p>{job.organization || "N/A"}</p>
                              </div>
                              <div>
                                <p>Start Date</p>
                                <p>{job.startDate || "N/A"}</p>
                              </div>
                              <div>
                                <p>End Date</p>
                                <p>{job.endDate || "Present"}</p>
                              </div>
                              <div>
                                <p>Duration</p>
                                <p>{job.duration || "N/A"}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No employment records found</p>
                        )}
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
                        <div>
                          <label>Department</label>
                          <p>{programDetails?.department || "N/A"}</p>
                        </div>
                        <div>
                          <label>Roll Number</label>
                          <p>{programDetails?.rollNumber || "N/A"}</p>
                        </div>
                        <div>
                          <label>Institute</label>
                          <p>{programDetails?.institute || "N/A"}</p>
                        </div>
                        <div>
                          <label>Year of Admission</label>
                          <p>{programDetails?.enrollmentYear || "N/A"}</p>
                        </div>
                        <div>
                          <label>Current Semester</label>
                          <p>{programDetails?.semester || "N/A"}</p>
                        </div>
                        <div>
                          <label>Guide Name</label>
                          <p>{programDetails?.guideName || "N/A"}</p>
                        </div>
                        <div>
                          <label>Guide Email</label>
                          <p>{programDetails?.guideEmail || "N/A"}</p>
                        </div>
                        <div>
                          <label>Status</label>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {programDetails?.status || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label>Domain of Research</label>
                          <p>{programDetails?.domain || "N/A"}</p>
                        </div>
                        <div>
                          <label>Topic of Research</label>
                          <p>{programDetails?.topic || "N/A"}</p>
                        </div>
                      </div>

                      <div>
                        <label>Research Description</label>
                        <p>{programDetails?.researchDescription || "N/A"}</p>
                      </div>

                      <div>
                        <label>Bonds with Institute</label>
                        <p>{programDetails?.bonds || "N/A"}</p>
                      </div>

                      <div>
                        <label>Scholarship</label>
                        <p>{programDetails?.scholarship || "N/A"}</p>
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
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeSection === "personal" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`}
                    onClick={() => setActiveSection("personal")}
                  >
                    <User
                      className={`w-4 h-4 mr-2 ${activeSection === "personal" ? "text-[#ED1C24]" : "text-black"}`}
                    />
                    Personal Details
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeSection === "educational" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`}
                    onClick={() => setActiveSection("educational")}
                  >
                    <GraduationCap
                      className={`w-4 h-4 mr-2 ${activeSection === "educational" ? "text-[#ED1C24]" : "text-black"}`}
                    />
                    Educational Details
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeSection === "program" ? "bg-gray-100 text-[#ED1C24]" : "text-black"} hover:bg-gray-100 cursor-pointer`}
                    onClick={() => setActiveSection("program")}
                  >
                    <BookOpen
                      className={`w-4 h-4 mr-2 ${activeSection === "program" ? "text-[#ED1C24]" : "text-black"}`}
                    />
                    Program Details
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
