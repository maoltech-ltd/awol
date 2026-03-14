import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  alt_phone?: string | null;
  address: string;

  id_type?: string | null;
  id_number?: string | null;

  guarantor_name?: string | null;
  guarantor_phone?: string | null;

  created_at: string;
}

interface CustomerState {
    customers: Customer[];
    customer: Customer | null;
    contracts: any[];
    payments: any[];
    status: string;
}

const initialState: CustomerState = {
    customers: [],
    customer: null,
    contracts: [],
    payments: [],
    status: "idle",
};

// ALL CUSTOMERS
export const fetchCustomers = createAsyncThunk("customers/all", async ({token, page}: {token: string, page: number}) => {
    const res = await api.get( `v1/awol/customers/?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.results || res.data;
});

// SINGLE CUSTOMER (contracts + payments)
export const fetchCustomerDetails = createAsyncThunk(
    "customers/details",
    async ({token, id}: {token: string, id: string}) => {
        const res = await api.get( `v1/awol/customers/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

// ADD CUSTOMER
export const addCustomer = createAsyncThunk(
    "customers/add",
    async ({token, data}: {token: string, data: Partial<Customer>}) => {
        const res = await api.post( "v1/awol/customers/add/", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(fetchCustomerDetails.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.customer = action.payload;
                state.contracts = action.payload.contracts || [];
                state.payments = action.payload.payments || [];
            })
            .addCase(fetchCustomerDetails.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(addCustomer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.customer = action.payload;
                // state.contracts = action.payload.contracts;
                // state.payments = action.payload.payments;
            })
            .addCase(addCustomer.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default customerSlice.reducer;
