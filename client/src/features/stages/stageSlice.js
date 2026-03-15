import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStages,
  fetchStageById,
  createStage,
  updateStage,
  deleteStage,
} from "./stageThunks";

const stagesSlice = createSlice({
  name: "stages",
  initialState: { list: [], status: "idle", error: null, message: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.status = "succeeded";
        const map = new Map(state.list.map((c) => [c.stage_id, c]));
        (action.payload || []).forEach((c) => {
          map.set(c.stage_id, c);
        });
        state.list = Array.from(map.values());
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStageById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStageById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.stage_id === action.payload.stage_id,
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(fetchStageById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createStage.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(createStage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.stage_id === action.payload.stage_id,
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
        state.message = action.payload?.message || "Stage created";
      })
      .addCase(createStage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to create stage";
      })
      .addCase(updateStage.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(updateStage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.stage_id === action.payload.stage_id,
        );
        if (index !== -1) state.list[index] = action.payload;
        state.message = action.payload?.message || "Stage updated";
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to update stage";
      })
      .addCase(deleteStage.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(deleteStage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((c) => c.stage_id !== action.payload);
        state.message = "Stage deleted";
      })
      .addCase(deleteStage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to delete stage";
      });
  },
});

export default stagesSlice.reducer;
