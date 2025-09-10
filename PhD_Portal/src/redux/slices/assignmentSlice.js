import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assignmentService from '../../services/assignmentService';

// Async thunks for assignment operations
export const fetchAssignmentsByGuide = createAsyncThunk(
  'assignments/fetchByGuide',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getAssignmentsByGuide();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAssignmentById = createAsyncThunk(
  'assignments/fetchById',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getAssignmentById(assignmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignments/submit',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await assignmentService.submitAssignment(submissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await assignmentService.createAssignment(assignmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAssignmentsByGuideId = createAsyncThunk(
  'assignments/fetchByGuideId',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getAssignmentsByGuideId();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSubmissionsForAssignment = createAsyncThunk(
  'assignments/fetchSubmissions',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getSubmissionsForAssignment(assignmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'assignments/gradeSubmission',
  async (gradeData, { rejectWithValue }) => {
    try {
      const response = await assignmentService.gradeSubmission(gradeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchNonSubmissions = createAsyncThunk(
  'assignments/fetchNonSubmissions',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getNonSubmissions(assignmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  // Student assignments
  assignments: [],
  currentAssignment: null,

  // Guide assignments
  guideAssignments: [],
  submissions: [],
  nonSubmissions: [],

  // UI states
  loading: false,
  error: null,
  submissionLoading: false,
  createLoading: false,
  gradeLoading: false,

  // Filters and search
  searchTerm: '',
  statusFilter: 'all', // all, pending, submitted, graded
  sortBy: 'deadline', // deadline, title, status
  sortOrder: 'asc', // asc, desc
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    updateAssignmentStatus: (state, action) => {
      const { assignmentId, status } = action.payload;
      const assignment = state.assignments.find(a => a._id === assignmentId);
      if (assignment) {
        assignment.status = status;
      }
    },
    addNewAssignment: (state, action) => {
      state.guideAssignments.unshift(action.payload);
    },
    updateSubmissionGrade: (state, action) => {
      const { submissionId, grade, comments } = action.payload;
      const submission = state.submissions.find(s => s._id === submissionId);
      if (submission) {
        submission.grade = grade;
        submission.comments = comments;
        submission.status = 'graded';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments by guide
      .addCase(fetchAssignmentsByGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignmentsByGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch assignment by ID
      .addCase(fetchAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit assignment
      .addCase(submitAssignment.pending, (state) => {
        state.submissionLoading = true;
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.submissionLoading = false;
        // Update the assignment status in the list
        const assignmentId = action.payload.assignment;
        const assignment = state.assignments.find(a => a._id === assignmentId);
        if (assignment) {
          assignment.status = 'submitted';
        }
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.submissionLoading = false;
        state.error = action.payload;
      })

      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.createLoading = false;
        state.guideAssignments.unshift(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Fetch assignments by guide ID (for guides)
      .addCase(fetchAssignmentsByGuideId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByGuideId.fulfilled, (state, action) => {
        state.loading = false;
        state.guideAssignments = action.payload;
      })
      .addCase(fetchAssignmentsByGuideId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch submissions for assignment
      .addCase(fetchSubmissionsForAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsForAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissionsForAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Grade submission
      .addCase(gradeSubmission.pending, (state) => {
        state.gradeLoading = true;
        state.error = null;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.gradeLoading = false;
        // Update the submission in the list
        const updatedSubmission = action.payload;
        const index = state.submissions.findIndex(s => s._id === updatedSubmission._id);
        if (index !== -1) {
          state.submissions[index] = updatedSubmission;
        }
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.gradeLoading = false;
        state.error = action.payload;
      })

      // Fetch non-submissions
      .addCase(fetchNonSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNonSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.nonSubmissions = action.payload;
      })
      .addCase(fetchNonSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentAssignment,
  setSearchTerm,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  updateAssignmentStatus,
  addNewAssignment,
  updateSubmissionGrade,
} = assignmentSlice.actions;

// Selectors
export const selectAssignments = (state) => state.assignments.assignments;
export const selectCurrentAssignment = (state) => state.assignments.currentAssignment;
export const selectGuideAssignments = (state) => state.assignments.guideAssignments;
export const selectSubmissions = (state) => state.assignments.submissions;
export const selectNonSubmissions = (state) => state.assignments.nonSubmissions;
export const selectAssignmentLoading = (state) => state.assignments.loading;
export const selectSubmissionLoading = (state) => state.assignments.submissionLoading;
export const selectCreateLoading = (state) => state.assignments.createLoading;
export const selectGradeLoading = (state) => state.assignments.gradeLoading;
export const selectAssignmentError = (state) => state.assignments.error;
export const selectSearchTerm = (state) => state.assignments.searchTerm;
export const selectStatusFilter = (state) => state.assignments.statusFilter;
export const selectSortBy = (state) => state.assignments.sortBy;
export const selectSortOrder = (state) => state.assignments.sortOrder;

// Filtered and sorted assignments selector
export const selectFilteredAssignments = (state) => {
  const assignments = selectAssignments(state);
  const searchTerm = selectSearchTerm(state);
  const statusFilter = selectStatusFilter(state);
  const sortBy = selectSortBy(state);
  const sortOrder = selectSortOrder(state);

  let filtered = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Sort assignments
  filtered.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'deadline':
        aValue = new Date(a.deadline);
        bValue = new Date(b.deadline);
        break;
      case 'status':
        aValue = a.status?.toLowerCase() || '';
        bValue = b.status?.toLowerCase() || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

export default assignmentSlice.reducer;
