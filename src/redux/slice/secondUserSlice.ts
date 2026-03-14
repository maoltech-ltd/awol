import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SecondUserState {
    userId: string;
    userName: string;
    userEmail: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    bio?: string[];
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
}


const  secondUserInitialState: SecondUserState = {
    userId: "",
    userName: "", 
    userEmail: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    bio: [],
    status: "idle"
};


export const getUserDetails = createAsyncThunk('user/getUserDetails', async (data: {username: string, token: string} ) => {
    const headers = {
        Authorization: "Bearer " + data.token
    };
    const response = await api.get(`v1/user/${data.username}`, { headers });
    return response.data;
});

export const getUserById = createAsyncThunk('user/getUserById', async (userId: string ) => {
    const response = await api.get(`v1/user/id/${userId}`);
    return response.data;
});

const secondUserSlice = createSlice({
    name: "secondUser",
    initialState: secondUserInitialState,
    reducers: {
        clearSecondUserState(state) {
            state.userId = "";
            state.userName = "";
            state.userEmail = "";
            state.firstName = "";
            state.lastName = "";
            state.profilePicture = "";
            state.bio = [];
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.userId = action.payload.id;
                state.userName = action.payload.username;
                state.userEmail = action.payload.email;
                state.firstName = action.payload.first_name;
                state.lastName = action.payload.last_name;
                state.profilePicture = action.payload.profile_picture;
                state.bio = action.payload.bio;
                state.status = "fulfilled";
            })
            .addCase(getUserDetails.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getUserDetails.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.userId = action.payload.id;
                state.userName = action.payload.username;
                state.userEmail = action.payload.email;
                state.firstName = action.payload.first_name;
                state.lastName = action.payload.last_name;
                state.profilePicture = action.payload.profile_picture;
                state.bio = action.payload.bio;
                state.status = "fulfilled";
            })
            .addCase(getUserById.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getUserById.rejected, (state) => {
                state.status = "rejected";
            });
    }
});

export const { clearSecondUserState } = secondUserSlice.actions;
export default secondUserSlice.reducer;
