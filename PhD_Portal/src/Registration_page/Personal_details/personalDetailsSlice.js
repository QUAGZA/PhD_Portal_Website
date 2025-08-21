import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  motherName: "",
  fatherName: "",
  gender: "",
  maritalStatus: "",
  aadhar: "",
  addressLine1: "",
  addressLine2: "",
  district: "",
  state: "",
  pinCode: "",
  permanentAddressLine1: "",
  permanentAddressLine2: "",
  permanentDistrict: "",
  permanentState: "",
  permanentPinCode: "",
  contacts: {
    mobile: "",
    alternateMobile: "",
    primaryEmail: "",
    alternateEmail: "",
  },
};

const personalDetailsSlice = createSlice({
  name: "personalDetails",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (field.includes(".")) {
        // Handle nested fields like 'contacts.mobile'
        const [parent, child] = field.split(".");
        state[parent][child] = value;
      } else {
        state[field] = value;
      }
    },
    resetForm: () => initialState,
    setAllFields: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateField, resetForm, setAllFields } =
  personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;
