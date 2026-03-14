import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DefaultState {
    customers: any[];
    customer: any | null;
    status: string;
}

const initialState: DefaultState = {
    customers: [],
    customer: null,
    status: "idle",
};

// ALL CUSTOMERS
export const fetchDefaults = createAsyncThunk("defaults/all", async ({token, page}: {token: string, page: number}) => {
    const res = await api.get( `v1/awol/customers/default?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.results || res.data;
});

// SINGLE CUSTOMER (contracts + payments)
export const fetchDefaultDetails = createAsyncThunk(
    "defaults/details",
    async ({token, id}: {token: string, id: string}) => {
        const res = await api.get( `v1/awol/customers/default/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);



const defaultSlice = createSlice({
    name: "default",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDefaults.fulfilled, (state, action) => {
            state.customers = action.payload;
            })
            .addCase(fetchDefaultDetails.fulfilled, (state, action) => {
            state.customer = action.payload;
            })
    },
});

export default defaultSlice.reducer;
