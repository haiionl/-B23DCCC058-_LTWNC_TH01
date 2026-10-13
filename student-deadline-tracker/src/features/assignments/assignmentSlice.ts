import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAssignmentsAPI } from "./assignmentAPI";
import type { Assignment } from "../../types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface AssignmentsState {
  items: Assignment[];
  status: RequestStatus;
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>("assignments/fetchAssignments", async (_, { rejectWithValue }) => {
  const response = await fetchAssignmentsAPI();
  if (response.status !== 200) {
    return rejectWithValue(response.message);
  }
  return response.data;
});

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    assignmentAdded(state, action: PayloadAction<Assignment>) {
      state.items.unshift(action.payload);
    },
    assignmentToggled(state, action: PayloadAction<string>) {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) assignment.completed = !assignment.completed;
    },
    assignmentDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Không thể tải bài tập.";
      });
  },
});

export const { assignmentAdded, assignmentToggled, assignmentDeleted } =
  assignmentsSlice.actions;
export type { AssignmentsState, RequestStatus };
export default assignmentsSlice.reducer;
