import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------------------------------------------
   Types
----------------------------------------------------*/

// Author Stats
export interface AuthorStats {
    id: number;
    total_views: number;
    total_posts: number;
    average_views_per_post: number;
    last_updated: string;
    author: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        bio: string[];
        profile_picture: string;
        is_author: boolean;
        created_at: string;
        updated_at: string;
    };
}

// Single Post (used inside pagination results)
export interface AuthorPost {
    id: number;
    title: string;
    category: string;
    slug: string;
    publication_date: string;
    stats: {
        total_views: number;
        unique_views: number;
        average_time_spent: number;
        last_viewed: string;
    } | null;
}

// Paginated Posts Response
export interface AuthorPostsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AuthorPost[];
}

// State
interface AuthorState {
    stats: AuthorStats | null;
    posts: AuthorPostsResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthorState = {
    stats: null,
    posts: null,
    status: "idle",
    error: null,
};

/* --------------------------------------------------------
   Fetch Author Stats
--------------------------------------------------------- */
export const fetchAuthorMe = createAsyncThunk(
    "author/fetchAuthorMe",
    async (token: string) => {
        const headers = {
            Authorization: "Bearer " + token,
        };
        const response = await api.get("v1/admin/author/stats/author/me/", {
            headers,
        });
        return response.data as AuthorStats;
    }
);

/* --------------------------------------------------------
   FETCH AUTHOR POSTS WITH PAGINATION
--------------------------------------------------------- */
export const fetchAuthorPosts = createAsyncThunk(
    "author/fetchAuthorPosts",
    async (
        {
            token,
            page = 1,
        }: { token: string; page?: number }
    ) => {
        const headers = {
            Authorization: "Bearer " + token,
        };

        const response = await api.get(
            `v1/admin/author/stats/author/posts/?page=${page}`,
            { headers }
        );

        return response.data as AuthorPostsResponse;
    }
);

/* --------------------------------------------------------
   SLICE
--------------------------------------------------------- */
const authorSlice = createSlice({
    name: "author",
    initialState,
    reducers: {
        clearAuthorData: (state) => {
            state.stats = null;
            state.posts = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* -------- Fetch Author Stats -------- */
        builder
            .addCase(fetchAuthorMe.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAuthorMe.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.stats = action.payload;
            })
            .addCase(fetchAuthorMe.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch author stats.";
            });

        /* -------- Fetch Author Posts (Pagination) -------- */
        builder
            .addCase(fetchAuthorPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchAuthorPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch author posts.";
            });
    },
});

export const { clearAuthorData } = authorSlice.actions;
export default authorSlice.reducer;
