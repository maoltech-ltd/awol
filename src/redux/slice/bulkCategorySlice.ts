import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CategoryState {
  categoriesByName: Record<string, any>; // store posts per category
  status: Record<string, string>;        // track loading per category
  error: Record<string, string | null>;  // track errors per category
}

const initialState: CategoryState = {
  categoriesByName: {},
  status: {},
  error: {},
};

// Thunk to fetch posts for a specific category
export const fetchBulkCategories = createAsyncThunk(
  "categories/fetchBulkCategories",
  async (category: string) => {
    const response = await api.get(`v1/blog/latest-posts/category/${category}/`);
    return { category, data: response.data };
  }
);

const bulkCategorySlice = createSlice({
  name: "bulkCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBulkCategories.pending, (state, action) => {
        const category = action.meta.arg;
        state.status[category] = "loading";
        state.error[category] = null;
      })
      .addCase(fetchBulkCategories.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        state.status[category] = "succeeded";
        state.categoriesByName[category] = data;
      })
      .addCase(fetchBulkCategories.rejected, (state, action) => {
        const category = action.meta.arg;
        state.status[category] = "failed";
        state.error[category] =
          action.error.message || "Failed to fetch category data.";
      });
  },
});

export default bulkCategorySlice.reducer;
