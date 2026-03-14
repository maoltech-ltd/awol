import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ImageState {
    image: string;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface ErrorPayload {
    error?: string;
    message?: string;
}

const initialState: ImageState = {
    image: "",
    status: "idle",
    error: null,
};

// Thunk to create a new post
// export const createImage = createAsyncThunk('posts/createImage', async (newImage: File) => {
//     if(newImage instanceof File){
//     const formData = new FormData();
//     formData.append('file', newImage)
//     const headers = {
//         'Content-Type': 'multipart/form-data'
//     }
//     const response = await api.post('v1/file/', formData, {headers});
//     return response.data;
//     }
// });
export const createImage = createAsyncThunk('posts/createImage', async (newImage: File, { rejectWithValue }) => {
    if(newImage instanceof File){
        try {
            const formData = new FormData();
            formData.append('file', newImage)
            const headers = {
                'Content-Type': 'multipart/form-data'
            }
            const response = await api.post('v1/file/', formData, {headers});
            return response.data;
        } catch (error: any) {
            // Use rejectWithValue to properly format the error
            return rejectWithValue(error.response?.data as ErrorPayload || { 
                error: "File upload failed", 
                message: "File upload failed" 
            });
        }
    }
});


const imageSlice = createSlice({
    name: "image",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create image
            .addCase(createImage.fulfilled, (state: any, action) => {
                state.status = "succeeded";
                state.image = action.payload.url;
            })
            .addCase(createImage.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(createImage.rejected, (state: any, action) => {
                state.status = "failed";
                const payload = action.payload as ErrorPayload | undefined;
                state.error = payload?.message || action.error?.message || "Upload failed. Please try again.";
            })
    },
});

export const { clearError } = imageSlice.actions;
export default imageSlice.reducer;
