import { configureStore } from "@reduxjs/toolkit";
import personalDetailsReducer from "../Registration_page/Personal_details/personalDetailsSlice";
import educationDetailsReducer from "../Registration_page/Educational_details/educationDetailsSlice";
import courseDetailsReducer from "../Registration_page/Course_details/courseDetailsSlice";
import studentDashboardReducer from "../pages/dashboard/studentDashboardSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    personalDetails: personalDetailsReducer,
    educationDetails: educationDetailsReducer,
    courseDetails: courseDetailsReducer,
    studentDashboard: studentDashboardReducer,
    auth: authReducer,
  },
});
