import { createSlice } from "@reduxjs/toolkit";
import {
  fetchColumns,
  fetchColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
} from "./columnThunks";

const columnsSlice = createSlice({
  name: "columns",
  initialState: { list: [], status: "idle", error: null, message: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.status = "succeeded";
        const map = new Map(state.list.map((c) => [c.status_id, c]));
        (action.payload || []).forEach((c) => {
          map.set(c.status_id, c);
        });
        state.list = Array.from(map.values());
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchColumnById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchColumnById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.status_id === action.payload.status_id,
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
      })
      .addCase(fetchColumnById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createColumn.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.status_id === action.payload.status_id,
        );
        if (index === -1) state.list.push(action.payload);
        else state.list[index] = action.payload;
        state.message = action.payload?.message || "Column created";
      })
      .addCase(createColumn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to create column";
      })
      .addCase(updateColumn.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (c) => c.status_id === action.payload.status_id,
        );
        if (index !== -1) state.list[index] = action.payload;
        state.message = action.payload?.message || "Column updated";
      })
      .addCase(updateColumn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to update column";
      })
      .addCase(deleteColumn.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((c) => c.status_id !== action.payload);
        state.message = "Column deleted";
      })
      .addCase(deleteColumn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.message = action.payload || "Failed to delete column";
      });
  },
});

export default columnsSlice.reducer;
