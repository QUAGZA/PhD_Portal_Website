import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepartment,
  setInstitute,
  setEnrollmentYear,
  selectCourseDetails,
} from "./courseDetailsSlice.js";

const CourseDetails = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const { department, institute, enrollmentYear } =
    useSelector(selectCourseDetails);

  // date range for year of passing
  const currentYear = new Date().getFullYear();
  const startYear = 1960;
  const years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation (you can enhance this)
    if (!department || !institute || !enrollmentYear) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    setActiveTab("uploadDocuments");
  };

  return (
    <form className="p-4 bg-white shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-medium text-[#B7202E] mb-4 border-b pb-2">
        Course Details
      </h2>
      <h3 className="mt-4 block font-semibold text-[#004466] mb-4">
        Doctorate Program Details
      </h3>
      <div className="grid grid-cols-1 gap-2 mt-2 mb-2">
        <input
          type="text"
          placeholder="Department of Research"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={department}
          onChange={(e) => dispatch(setDepartment(e.target.value))}
        />
        <input
          type="text"
          placeholder="Institute"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={institute}
          onChange={(e) => dispatch(setInstitute(e.target.value))}
        />
        <select
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={enrollmentYear}
          onChange={(e) => dispatch(setEnrollmentYear(e.target.value))}
        >
          <option value="" disabled>
            Enrollment Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {/* Buttons */}
      <div className="flex justify-end mt-10 space-x-4">
        <button
          type="button"
          className="bg-[#006699] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#004e75]"
          onClick={() => setActiveTab("educationalDetails")}
        >
          &lt; Previous
        </button>
        <button
          type="submit"
          className="bg-[#B7202E] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#801721]"
        >
          Proceed &gt;
        </button>
      </div>
    </form>
  );
};

export default CourseDetails;
