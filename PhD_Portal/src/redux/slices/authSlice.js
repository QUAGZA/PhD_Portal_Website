import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await userService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

// Other async thunks for registration, etc.

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    // Handle async actions
  },
});

export default authSlice.reducer;
