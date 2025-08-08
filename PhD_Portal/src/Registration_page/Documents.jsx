import { useState } from "react";
import { useDispatch, useStore, useSelector } from "react-redux";
import FileInput from "./File_input"; // adjust path as needed
import userService from "../services/userService";

const Document = ({ setActiveTab }) => {
  const [files, setFiles] = useState({
    undergradMarksheet: null,
    postgradMarksheet: null,
    undergradCertificate: null,
    postgradCertificate: null,
    aadharCard: null,
    eligibilityCertificate: null,
    migrationCertificate: null,
    passportPhoto: null,
    bonafideCertificate: null,
    nocCertificate: null,
  });

  const personalDetails = useSelector((state) => state.personalDetails);
  const undergradDegrees = useSelector(
    (state) => state.educationDetails.undergradDegrees,
  );
  const postgradDegrees = useSelector(
    (state) => state.educationDetails.postgradDegrees,
  );
  const employmentDetails = useSelector(
    (state) => state.educationDetails.employmentRecords,
  );

  // const academicDetails = {
  //   undergradDegrees: undergradDegrees,
  //   postgradDegrees: postgradDegrees,
  // }

  const AcademicU = undergradDegrees.map((degree) => ({
    ...degree,
    email: personalDetails.email,
  }));
  const AcademicP = postgradDegrees.map((degree) => ({
    ...degree,
    type: "PG",
    email: personalDetails.email,
  }));

  // console.log("Academic U:", AcademicU);
  // console.log("Academic P:", AcademicP);

  const aq = [...AcademicU, ...AcademicP];
  const empDetails = employmentDetails.map((emp) => ({
    ...emp,
    email: personalDetails.email,
  }));

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.submitRegistration({
        personalDetails,
        academicQualifications: aq,
        employmentDetails: empDetails,
      });

      console.log("Registration submitted successfully:", response.data);

      // If registration was successful, proceed with file uploads
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      try {
        const uploadResponse = await userService.uploadDocuments(formData);
        console.log("Upload success:", uploadResponse.data);

        // Navigate to success page or next step
        alert("Registration completed successfully!");
        // Optionally redirect or show success message
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Document upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting details:", err);
      alert("Failed to submit details. Try again.");
    }
  };

  console.log("Personal Details:", personalDetails);
  console.log("ACADEMIC DETAILS:", aq);
  console.log("Postgraduate Degrees:", postgradDegrees);
  console.log("Employment Records:", empDetails);
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6  rounded-lg shadow space-y-5"
    >
      <h2 className="text-3xl font-medium text-[#B7202E] mb-6 border-b pb-2">
        Upload Documents
      </h2>
      <FileInput
        id="undergradMarksheet"
        label="Undergraduate Degree Marklist"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="postgradMarksheet"
        label="Postgraduate Degree Marklist"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="undergradCertificate"
        label="Undergraduate Degree Certificate"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="postgradCertificate"
        label="Postgraduate Degree Certificate"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="aadharCard"
        label="Aadhar Card"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="eligibilityCertificate"
        label="Degree Equivalence / Eligibility Certificate"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="migrationCertificate"
        label="Migration Certificate"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="passportPhoto"
        label="Passport Size Photograph"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="bonafideCertificate"
        label="Bonafide Certificate"
        onFileChange={handleFileChange}
      />
      <FileInput
        id="nocCertificate"
        label="No Objection Certificate (NOC)"
        onFileChange={handleFileChange}
      />
      <div className="flex items-center space-x-4 mb-4 mt-10 justify-center">
        <button
          className="bg-[#006699] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#004e75]"
          onClick={() => setActiveTab("courseDetails")}
        >
          &lt; Previous
        </button>
        <button
          type="submit"
          className=" bg-[#B7202E] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#801721]"
        >
          {" "}
          Submit &gt;
        </button>
      </div>
    </form>
  );
};

export default Document;
