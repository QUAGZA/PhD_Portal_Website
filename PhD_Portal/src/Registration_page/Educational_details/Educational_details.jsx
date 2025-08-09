import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineTrash } from "react-icons/hi2";
import {
  addUG,
  deleteUG,
  addPG,
  deletePG,
  addEmployment,
  deleteEmployment,
} from "./educationDetailsSlice";

const EducationalDetails = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const undergradDegrees = useSelector(
    (state) => state.educationDetails.undergradDegrees,
  );
  const postgradDegrees = useSelector(
    (state) => state.educationDetails.postgradDegrees,
  );
  const employmentRecords = useSelector(
    (state) => state.educationDetails.employmentRecords,
  );

  const [ugForm, setUgForm] = useState({
    title: "",
    institute: "",
    university: "",
    yearOfPassing: "",
    type: "UG",
  });
  const [pgForm, setPgForm] = useState({
    title: "",
    institute: "",
    university: "",
    yearOfPassing: "",
    type: "PG",
  });
  const [empForm, setEmpForm] = useState({
    designation: "",
    employer: "",
    startDate: "",
    endDate: "",
  });

  const tableRef = useRef(null);

  const addUndergradDegree = () => {
    if (
      ugForm.title &&
      ugForm.institute &&
      ugForm.university &&
      ugForm.yearOfPassing &&
      ugForm.type
    ) {
      dispatch(addUG(ugForm));
      setUgForm({
        title: "",
        institute: "",
        university: "",
        yearOfPassing: "",
        type: "UG",
      });
    }
  };

  const deleteUndergrad = (index) => {
    dispatch(deleteUG(index));
  };

  const addPostgradDegree = () => {
    if (
      pgForm.title &&
      pgForm.institute &&
      pgForm.university &&
      pgForm.yearOfPassing
    ) {
      dispatch(addPG(pgForm));
      setPgForm({
        title: "",
        institute: "",
        university: "",
        yearOfPassing: "",
        type: "PG",
      });
    }
  };

  const deletePostgrad = (index) => {
    dispatch(deletePG(index));
  };

  const addEmploymentRecord = () => {
    if (
      empForm.designation &&
      empForm.employer &&
      empForm.startDate &&
      empForm.endDate
    ) {
      dispatch(addEmployment(empForm));
      setEmpForm({ designation: "", employer: "", startDate: "", endDate: "" });
    }
  };

  const deleteEmploymentRecord = (index) => {
    dispatch(deleteEmployment(index));
  };

  // date range for year of passing
  const currentYear = new Date().getFullYear();
  const startYear = 1960;
  const endYear = currentYear; // Customize as needed
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-medium text-[#B7202E] mb-4 border-b pb-2">
        Educational Details
      </h2>

      <div className="card">
        <div className="card-content p-4 space-y-4">
          <h3 className="font-semibold mt-4 block text-[#004466]">
            UNDER GRADUATE or Equivalent
          </h3>
          <div className="grid grid-cols-1 gap-2 mt-2 mb-2">
            <input
              type="text"
              placeholder="Title"
              value={ugForm.title}
              onChange={(e) => setUgForm({ ...ugForm, title: e.target.value })}
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <input
              type="text"
              placeholder="Institute"
              value={ugForm.institute}
              onChange={(e) =>
                setUgForm({ ...ugForm, institute: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <input
              type="text"
              placeholder="University"
              value={ugForm.university}
              onChange={(e) =>
                setUgForm({ ...ugForm, university: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <select
              type="text"
              placeholder="Year"
              value={ugForm.yearOfPassing}
              onChange={(e) =>
                setUgForm({ ...ugForm, yearOfPassing: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            >
              <option value="" disabled selected hidden>
                Year of Passing
              </option>{" "}
              {/* TODO: Need to change font color to match the other text input placeholders*/}
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addUndergradDegree}
              className="btn btn text-blue-700 mt-2 p-2 cursor-pointer hover:bg-blue-100 rounded right-0 active:bg-blue-200"
            >
              + Add UG Degree
            </button>
          </div>
          {undergradDegrees.length > 0 && (
            <div className="relative mt-4">
              <div
                className="max-h-40 overflow-y-auto border-0.5 rounded"
                ref={tableRef}
              >
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">Title</th>
                      <th className="p-2 border">Institute</th>
                      <th className="p-2 border">University</th>
                      <th className="p-2 border">Year</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {undergradDegrees.map((degree, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{degree.title}</td>
                        <td className="p-2 border">{degree.institute}</td>
                        <td className="p-2 border">{degree.university}</td>
                        <td className="p-2 border">{degree.yearOfPassing}</td>
                        <td className="p-2 border">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => deleteUndergrad(index)}
                              className="text-red-600 p-1 p-l-3 p-r-3 flex space-x-1 cursor-pointer rounded hover:bg-red-100 active:bg-red-200"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-content p-4 space-y-4">
          <h3 className="font-semibold mt-4 block font-semibold text-[#004466]">
            POST GRADUATE or Equivalent
          </h3>
          <div className="grid grid-cols-1 gap-2 mt-2 mb-2">
            <input
              type="text"
              placeholder="Title"
              value={pgForm.title}
              onChange={(e) => setPgForm({ ...pgForm, title: e.target.value })}
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <input
              type="text"
              placeholder="Institute"
              value={pgForm.institute}
              onChange={(e) =>
                setPgForm({ ...pgForm, institute: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <input
              type="text"
              placeholder="University"
              value={pgForm.university}
              onChange={(e) =>
                setPgForm({ ...pgForm, university: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <select
              type="text"
              placeholder="Year"
              value={pgForm.yearOfPassing}
              onChange={(e) =>
                setPgForm({ ...pgForm, yearOfPassing: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            >
              <option value="" disabled selected hidden>
                Year of Passing
              </option>{" "}
              {/* TODO: Need to change font color to match the other text input placeholders*/}
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addPostgradDegree}
              className="btn btn text-blue-700 mt-2 p-2 cursor-pointer hover:bg-blue-100 rounded right-0 active:bg-blue-200"
            >
              + Add PG Degree
            </button>
          </div>
          {postgradDegrees.length > 0 && (
            <div className="relative mt-4">
              <div
                className="max-h-40 overflow-y-auto border-0.5 rounded"
                ref={tableRef}
              >
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">Title</th>
                      <th className="p-2 border">Institute</th>
                      <th className="p-2 border">University</th>
                      <th className="p-2 border">Year</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postgradDegrees.map((degree, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{degree.title}</td>
                        <td className="p-2 border">{degree.institute}</td>
                        <td className="p-2 border">{degree.university}</td>
                        <td className="p-2 border">{degree.yearOfPassing}</td>
                        <td className="p-2 border">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => deletePostgrad(index)}
                              className="text-red-600 p-1 p-l-3 p-r-3 flex space-x-1 cursor-pointer rounded hover:bg-red-100 active:bg-red-200"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-content p-4 space-y-4">
          <h3 className="font-semibold mt-4 block font-semibold text-[#004466]">
            EMPLOYMENT
          </h3>
          <div className="grid grid-cols-1 gap-2 mt-2 mb-2">
            <input
              type="text"
              placeholder="Designation"
              value={empForm.designation}
              onChange={(e) =>
                setEmpForm({ ...empForm, designation: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <input
              type="text"
              placeholder="Employer"
              value={empForm.employer}
              onChange={(e) =>
                setEmpForm({ ...empForm, employer: e.target.value })
              }
              className="input p-2 bg-[#FFEBE9FE] rounded text-center"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                placeholder="Start Date"
                value={empForm.startDate}
                onChange={(e) =>
                  setEmpForm({ ...empForm, startDate: e.target.value })
                }
                className="input p-2 bg-[#FFEBE9FE] rounded text-center"
              />
              <input
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                placeholder="End Date"
                min={empForm.startDate}
                value={empForm.endDate}
                onChange={(e) =>
                  setEmpForm({ ...empForm, endDate: e.target.value })
                }
                className="input p-2 bg-[#FFEBE9FE] rounded text-center"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addEmploymentRecord}
              className="btn text-blue-700 mt-2 p-2 cursor-pointer hover:bg-blue-100 rounded right-0 active:bg-blue-200"
            >
              + Add Employment
            </button>
          </div>

          {employmentRecords.length > 0 && (
            <div className="relative mt-4">
              <div
                className="max-h-40 overflow-y-auto border-0.5 rounded"
                ref={tableRef}
              >
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">Designation</th>
                      <th className="p-2 border">Employer</th>
                      <th className="p-2 border">From</th>
                      <th className="p-2 border">To</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employmentRecords.map((record, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{record.designation}</td>
                        <td className="p-2 border">{record.employer}</td>
                        <td className="p-2 border">{record.startDate}</td>
                        <td className="p-2 border">{record.endDate}</td>
                        <td className="p-2 border">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => deleteEmploymentRecord(index)}
                              className="text-red-600 p-1 p-l-3 p-r-3 flex space-x-1 cursor-pointer rounded hover:bg-red-100 active:bg-red-200"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-10 space-x-4">
        <button
          className="bg-[#006699] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#004e75]"
          onClick={() => setActiveTab("personalDetails")}
        >
          &lt; Previous
        </button>
        <button
          className="bg-[#B7202E] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#801721]"
          onClick={() => setActiveTab("courseDetails")}
        >
          Proceed &gt;
        </button>
      </div>
    </div>
  );
};

export default EducationalDetails;
