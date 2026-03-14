import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Category {
    id: string;
    name: string;
    description: string;
}

interface CategoryState {
    categories: Category[];
    status: string;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    status: "idle",
    error: null,
};

// Thunk to fetch all categories
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (category: string) => {
    const response = await api.get(`v1/blog/latest-posts/category/${category}/`);
    return response.data;
});

// Thunk to add a new category
export const addCategory = createAsyncThunk('categories/addCategory', async (newCategory: { name: string; description: string }) => {
    const response = await api.post('/api/categories', newCategory);
    return response.data;
});

// Thunk to delete a category
export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId: string) => {
    await api.delete(`/api/categories/${categoryId}`);
    return categoryId;
});

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories = action.payload;
            })
            .addCase(fetchCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch categories.";
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories.push(action.payload);
            })
            .addCase(addCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add category.";
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories = state.categories.filter(category => category.id !== action.payload);
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete category.";
            });
    },
});

export default categorySlice.reducer;
