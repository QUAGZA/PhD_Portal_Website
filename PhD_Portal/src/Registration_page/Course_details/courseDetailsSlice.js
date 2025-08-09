import { createSlice } from "@reduxjs/toolkit";

const courseDetailsSlice = createSlice({
  name: "courseDetails",
  initialState: {
    department: "",
    institute: "",
    enrollmentYear: "",
  },
  reducers: {
    setDepartment(state, action) {
      state.department = action.payload;
    },
    setInstitute(state, action) {
      state.institute = action.payload;
    },
    setEnrollmentYear(state, action) {
      state.enrollmentYear = action.payload;
    },
    resetCourseDetails(state) {
      state.department = "";
      state.institute = "";
      state.enrollmentYear = "";
    },
  },
});

export const {
  setDepartment,
  setInstitute,
  setEnrollmentYear,
  resetCourseDetails,
} = courseDetailsSlice.actions;

// Selector for course details
export const selectCourseDetails = (state) => state.courseDetails;

export default courseDetailsSlice.reducer;
