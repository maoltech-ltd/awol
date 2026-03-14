import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Contract {
    id: number;
    customer: number;
    product_model: number;

    total_price: number;
    down_payment_paid: number;
    balance: number;
    monthly_payment: number;

    sale_date: string;
    next_due_date: string;

    item_serial_number?: string;
    is_installment: boolean;

    status: "active" | "completed" | "defaulted" | "repossessed";
    created_at: string;
}

interface ContractState {
    contracts: Contract[];
    status: "idle" | "loading" | "success" | "failed";
}

const initialState: ContractState = {
    contracts: [],
    status: "idle",
};

// CREATE CONTRACT
export const createContract = createAsyncThunk(
    "contracts/create",
    async ({token, data}: {token: string, data: Partial<Contract>}) => {
        const res = await api.post( "v1/awol/contracts/add/", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

// DEFAULTERS
export const fetchDefaulters = createAsyncThunk(
    "contracts/defaulters",
    async ({token}: {token: string}) => {
        const res = await api.get( "v1/awol/customers/defaulters/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

const contractSlice = createSlice({
    name: "contract",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchDefaulters.fulfilled, (state, action) => {
        state.contracts = action.payload;
        });
    },
});

export default contractSlice.reducer;
