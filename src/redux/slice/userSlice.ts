import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { headers } from "next/headers";


export interface UserState {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    userEmail: string;
    token: string;
    isLoggedIn: boolean;
    bio: string[];
    status: string;
    profilePicture: String;
    createdAt: Date | null;
    isAuthor: Boolean;
}

const initialState: UserState = {
    userId: "",
    userName: "",
    userEmail: "",
    token: "",
    status: "",
    profilePicture: "",
    firstName: "",
    lastName: "",
    bio: [],
    isLoggedIn: false,
    createdAt: null,
    isAuthor: false
}


export const fetchUser = createAsyncThunk('user/fetchUser', async (token: string) => {
    const headers = {
        Authorization: "Bearer " + token
    };
    const response = await api.post(`users/`, {}, { headers });
    return response.data;
});

export const loginUser = createAsyncThunk('user/loginUser', async (credentials: { email: string, password: string }) => {
    const response = await api.post(`v1/user/auth/signin/`, credentials);
    return response.data;
});

// Thunk for user registration
export const registerUser = createAsyncThunk('user/registerUser', async (userInfo: { name: string, email: string, password: string }) => {
    const response = await api.post(`v1/user/auth/signup/`, userInfo);
    return response.data;
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (userInfo: { data: any, token: string }) => {
    const headers = {
        Authorization: "Bearer " + userInfo.token
    };
    const payload = {
        ...userInfo.data, 
        first_name: userInfo.data.firstName,
        last_name: userInfo.data.lastName,
        profile_picture: userInfo.data.profilePicture
    }
    delete payload.firstName
    delete payload.lastName
    delete payload.profilePicture
    const response = await api.put(`v1/user/`, payload, { headers });
    return response.data;
});

// Thunk for refreshing token
export const refreshToken = createAsyncThunk('user/refreshToken', async (refreshToken: string) => {
    const response = await api.post(`v1/user/auth/refresh-token`, { token: refreshToken });
    return response.data;
});

  
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Reducer for logging out the user
        logoutUser(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.token = "";
            state.profilePicture = "";
            state.isLoggedIn = false;
            state.bio = [];
            state.status = "";
            state.createdAt = null;
            state.isAuthor = false;
            state.firstName = "";
            state.lastName = "";
        },
        // Reducer for clearing the state
        clearState(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.token = "";
            state.isLoggedIn = false;
            state.bio = [];
            state.profilePicture = "";
            state.status = "";
            state.createdAt = null;
            state.isAuthor = false;
            state.firstName = "";
            state.lastName = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.userId = action.payload.userId;
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.token = action.payload.token;
                state.status = action.payload.status;
                state.isLoggedIn = action.payload.isLoggedIn;
                state.profilePicture = action.payload.profile_picture;
                state.bio = action.payload.bio;
                state.createdAt = action.payload.createdAt;
                state.isAuthor = action.payload.is_author;
                state.firstName = action.payload.first_name;
                state.lastName = action.payload.last_name;

            })
            .addCase(fetchUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userId = action.payload.data.id;
                state.userName = action.payload.data.username;
                state.userEmail = action.payload.data.email;
                state.token = action.payload.token;
                state.profilePicture = action.payload.data.profile_picture;
                state.bio = action.payload.data.bio;
                state.createdAt = action.payload.data.createdAt;
                state.isLoggedIn = true;
                state.status = "fulfilled";
                state.isAuthor = action.payload.data.is_author;
                state.firstName = action.payload.data.first_name;
                state.lastName = action.payload.data.last_name;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userId = action.payload.data.id;
                state.userName = action.payload.data.username;
                state.userEmail = action.payload.data.email;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.status = "fulfilled";
            })
            .addCase(registerUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                state.profilePicture = action.payload.profile_picture;
                state.bio = action.payload.bio;
                state.firstName = action.payload.first_name;
                state.lastName = action.payload.last_name;
                state.status = "fulfilled";
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.status = "fulfilled";
            })
            .addCase(refreshToken.pending, (state) => {
                state.status = "pending";
            })
            .addCase(refreshToken.rejected, (state) => {
                state.status = "rejected";
            });
    }
});

export const { logoutUser, clearState } = userSlice.actions;
export default userSlice.reducer;