import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Comment {
    id: number;
    post: number;        // backend returns post_id as "post"
    author: string;      // assuming backend returns author username
    content: string;
    publish_date: string;  // matches serializer
    author_username: string;
}

interface CommentState {
    comments: Comment[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    status: "idle",
    error: null,
};

// Fetch comments for a post
export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (postId: number) => {
        const response = await api.get(`v1/blog/${postId}/comments/`);
        return response.data as Comment[];
    }
);

// Add a new comment
export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({ postId, content, token  }: { postId: number; content: string, token: string }) => {
        const headers = {
            Authorization: "Bearer " + token
        };
        const response = await api.post(`v1/blog/${postId}/comments/`, { content }, {headers});
        return response.data as Comment;
    }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async ({ postId, commentId }: { postId: number; commentId: number }) => {
        await api.delete(`v1/blog/${postId}/comments/${commentId}/`);
        return commentId;
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchComments.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch comments.";
            })
            // ADD
            .addCase(addComment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments.unshift(action.payload); // newest first
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add comment.";
            })
            // DELETE
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = state.comments.filter(
                    (c) => c.id !== action.payload
                );
            });
    },
});

export default commentSlice.reducer;
