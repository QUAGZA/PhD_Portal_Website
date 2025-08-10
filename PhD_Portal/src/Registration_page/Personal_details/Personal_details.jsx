import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "./personalDetailsSlice";

const PersonalDetails = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.personalDetails);

  const [sameAddress, setSameAddress] = useState(false);

  const handleChange = (field) => (e) => {
    dispatch(updateField({ field, value: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      dispatch(
        updateField({
          field: "permanentAddressLine1",
          value: formData.addressLine1,
        }),
      );
      dispatch(
        updateField({
          field: "permanentAddressLine2",
          value: formData.addressLine2,
        }),
      );
      dispatch(
        updateField({ field: "permanetDistrict", value: formData.district }),
      );
      dispatch(updateField({ field: "permanentState", value: formData.state }));
      dispatch(
        updateField({ field: "permanentPinCode", value: formData.pinCode }),
      );
    } else {
      dispatch(updateField({ field: "permanentAddressLine1", value: "" }));
      dispatch(updateField({ field: "permanentAddressLine2", value: "" }));
      dispatch(updateField({ field: "permanetDistrict", value: "" }));
      dispatch(updateField({ field: "permanentState", value: "" }));
      dispatch(updateField({ field: "permanentPinCode", value: "" }));
    }
  };

  useEffect(() => {
    if (sameAddress) {
      dispatch(
        updateField({
          field: "permanentAddressLine1",
          value: formData.addressLine1,
        }),
      );
      dispatch(
        updateField({
          field: "permanentAddressLine2",
          value: formData.addressLine2,
        }),
      );
      dispatch(
        updateField({ field: "permanetDistrict", value: formData.district }),
      );
      dispatch(updateField({ field: "permanentState", value: formData.state }));
      dispatch(
        updateField({ field: "permanentPinCode", value: formData.pinCode }),
      );
    }
  }, [
    formData.addressLine1,
    formData.addressLine2,
    formData.district,
    formData.state,
    formData.pinCode,
    sameAddress,
    dispatch,
  ]);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-medium text-[#B7202E] mb-4 border-b pb-2">
        Personal Details
      </h2>

      {/* Name */}
      <label className="block font-semibold text-[#004466]">Name</label>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <input
          value={formData.title}
          onChange={handleChange("title")}
          type="text"
          placeholder="Title"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.firstName}
          onChange={handleChange("firstName")}
          type="text"
          placeholder="First Name"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.middleName}
          onChange={handleChange("middleName")}
          type="text"
          placeholder="Middle Name"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.lastName}
          onChange={handleChange("lastName")}
          type="text"
          placeholder="Last Name"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
      </div>

      {/* Parents */}
      <div className="grid grid-rows-2 gap-2 mt-2">
        <input
          value={formData.motherName}
          onChange={handleChange("motherName")}
          type="text"
          placeholder="Mother's Name"
          className="p-2 bg-[#FFEBE9FE] rounded w-full text-center"
        />
        <input
          value={formData.fatherName}
          onChange={handleChange("fatherName")}
          type="text"
          placeholder="Father's Name"
          className="p-2 bg-[#FFEBE9FE] rounded w-full text-center"
        />
      </div>

      {/* Residential Address */}
      <h3 className="font-semibold text-[#004466] mt-6">Residential Address</h3>
      <div className="grid grid-cols-1 gap-2 mt-2">
        <input
          value={formData.addressLine1}
          onChange={handleChange("addressLine1")}
          type="text"
          placeholder="Address Line 1"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.addressLine2}
          onChange={handleChange("addressLine2")}
          type="text"
          placeholder="Address Line 2"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <input
          value={formData.district}
          onChange={handleChange("district")}
          type="text"
          placeholder="District"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <select
          value={formData.state}
          onChange={handleChange("state")}
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        >
          <option value="" disabled hidden>
            Select State
          </option>
          {states.map((x, y) => (
            <option key={y}>{x}</option>
          ))}
        </select>
        <input
          value={formData.pinCode}
          onChange={handleChange("pinCode")}
          type="number"
          placeholder="Pin Code"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
      </div>

      {/* Permanent Address */}
      <h3 className="font-semibold text-[#004466] mt-6">Permanent Address</h3>
      <div className="mt-3">
        <input
          type="checkbox"
          className="mr-2"
          checked={sameAddress}
          onChange={handleCheckboxChange}
        />
        <label className="text-gray-700">
          Permanent Address Same as Residential Address
        </label>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-2">
        <input
          type="text"
          placeholder="Address Line 1"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={formData.permanentAddressLine1}
          onChange={handleChange("permanentAddressLine1")}
          readOnly={sameAddress}
        />
        <input
          type="text"
          placeholder="Address Line 2"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={formData.permanentAddressLine2}
          onChange={handleChange("permanentAddressLine2")}
          readOnly={sameAddress}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <input
          type="text"
          placeholder="District"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={formData.permanentDistrict}
          onChange={handleChange("permanetDistrict")}
          readOnly={sameAddress}
        />
        <select
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={formData.permanentState}
          onChange={handleChange("permanentState")}
          disabled={sameAddress}
        >
          <option value="" disabled hidden>
            Select State
          </option>
          {states.map((x, y) => (
            <option key={y}>{x}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Pin Code"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
          value={formData.permanentPinCode}
          onChange={handleChange("permanentPinCode")}
          readOnly={sameAddress}
        />
      </div>

      {/* Other Info */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <label className="font-semibold text-[#004466]">Gender</label>
          <select
            value={formData.gender}
            onChange={handleChange("gender")}
            className="p-2 bg-[#FFEBE9FE] rounded w-full text-center"
          >
            <option disabled hidden>
              Select
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="font-semibold text-[#004466]">Aadhar Number</label>
          <input
            value={formData.aadhar}
            onChange={handleChange("aadhar")}
            type="text"
            placeholder="Aadhar"
            className="p-2 bg-[#FFEBE9FE] rounded w-full text-center"
          />
        </div>
        <div>
          <label className="font-semibold text-[#004466]">Marital Status</label>
          <select
            value={formData.maritalStatus}
            onChange={handleChange("maritalStatus")}
            className="p-2 bg-[#FFEBE9FE] rounded w-full"
          >
            <option disabled hidden>
              Select
            </option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>
      </div>

      {/* Contact Details */}
      <h3 className="text-3xl font-medium text-[#B7202E] mb-4 mt-6 border-b pb-2">
        Contact Details
      </h3>
      <label className="font-semibold text-[#004466]">Mobile Number</label>
      <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
        <input
          value={formData.contacts?.mobile || ""}
          onChange={handleChange("contacts.mobile")}
          type="number"
          placeholder="Mobile Number"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.contacts?.alternateMobile || ""}
          onChange={handleChange("contacts.alternateMobile")}
          type="number"
          placeholder="Alternate Mobile Number"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
      </div>
      <label className="font-semibold text-[#004466]">Email ID</label>
      <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
        <input
          value={formData.contacts?.primaryEmail || ""}
          onChange={handleChange("contacts.primaryEmail")}
          type="email"
          placeholder="Email ID"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
        <input
          value={formData.contacts?.alternateEmail || ""}
          onChange={handleChange("contacts.alternateEmail")}
          type="email"
          placeholder="Alternate Email ID"
          className="p-2 bg-[#FFEBE9FE] rounded text-center"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-10 space-x-4">
        <button
          className="bg-[#006699] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#004e75]"
          onClick={() => setActiveTab("overview")}
        >
          &lt; Previous
        </button>
        <button
          className="bg-[#B7202E] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#801721]"
          onClick={() => setActiveTab("educationalDetails")}
        >
          Proceed &gt;
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
