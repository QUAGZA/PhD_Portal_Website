import {React, useState, useEffect, useRef } from "react";
import Somaiya_Trust from "../assets/Somaiya_Trust.png";
import KJSSE from "../assets/SVU_KJSCE.png";
import Overview from "./Overview.jsx";
import PersonalDetails from "./Personal_details/Personal_details.jsx";
import EducationalDetails from "./Educational_details/Educational_details.jsx";
import CourseDetails from "./Course_details/Course_details.jsx";
import UploadDocuments from "./Documents";
import "./Registration_page.css";
// import UploadDocuments from "./UploadDocuments";



const Registration_page = ({ children }) => {

  const [activeTab, setActiveTab] = useState("overview");
  const formRef = useRef(null); // Reference to the form container

  function handleChange(newValue){
    setActiveTab(newValue);
  }

  // Scroll to top when activeTab changes {needs to be fixed}
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto scroll-smooth">
      <div className="fixed w-full top-0 z-10 ">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <img src={KJSSE} alt="Somaiya Logo" className="h-10" />
        <h1 className="text-3xl font-bold text-[#B7202E] mr-20">PhD Portal</h1>{/* !!! added right margin - 20 (mr-20) to center the text temporarily  */}
        <img src={Somaiya_Trust} alt="Somaiya Trust" className="h-10" />
      </header>

      {/* Navigation Bar */}
      <nav className="bg-gray-200 py-2 px-6 flex space-x-4 border-b border-b-[#B7202E] justify-center text-xl">
      <button className={`px-4 py-2 cursor-pointer hover:underline bg-[transparent] ${activeTab === "overview" ? " text-[#B7202E] " : "text-[#231F20] hover:text-[#004466]"}`} onClick={() => setActiveTab("overview")}>
        Overview
      </button>
      <button className={`px-4 py-2 cursor-pointer hover:underline bg-[transparent] ${activeTab === "personalDetails" ? " text-[#B7202E] " : "text-[#231F20] hover:text-[#004466]"}`} onClick={() => setActiveTab("personalDetails")}>
        Personal Details
      </button>
      <button className={`px-4 py-2 cursor-pointer hover:underline bg-[transparent] ${activeTab === "educationalDetails" ? " text-[#B7202E] " : "text-[#231F20] hover:text-[#004466]"}`} onClick={() => setActiveTab("educationalDetails")}>
        Educational Details
      </button>
      <button className={`px-4 py-2 cursor-pointer hover:underline bg-[transparent] ${activeTab === "courseDetails" ? " text-[#B7202E] " : "text-[#231F20] hover:text-[#004466]"}`} onClick={() => setActiveTab("courseDetails")}>
        Course Details
      </button>
      <button className={`px-4 py-2 cursor-pointer hover:underline bg-[transparent] ${activeTab === "uploadDocuments" ? " text-[#B7202E] " : "text-[#231F20] hover:text-[#004466]"}`} onClick={() => setActiveTab("uploadDocuments")}>
        Upload Documents
      </button>
      </nav>
      </div>
      {/* Main Content */}
      <main className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-30">
        {activeTab == "overview" && <Overview setActiveTab={setActiveTab} />}
        {activeTab == "personalDetails" && <PersonalDetails setActiveTab={setActiveTab} />}
        {activeTab == "educationalDetails" && <EducationalDetails setActiveTab={setActiveTab} />}
        {activeTab == "courseDetails" && <CourseDetails setActiveTab={setActiveTab} />}
        {activeTab == "uploadDocuments" && <UploadDocuments setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
};

export default Registration_page;
